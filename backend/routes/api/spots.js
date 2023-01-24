const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Spot, SpotImage, Review } = require('../../db/models');
const { Sequelize } = require('sequelize');


router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"], 'previewImage'],
        include: {
            model: Review,
            attributes: []
        }
    });
    
    const spotsData = [];
    for (let spot of spots) {
        const tmpSpot = spot.toJSON();
        tmpSpot.avgRating = Math.round(tmpSpot.avgRating);
        spotsData.push(tmpSpot);
    }
    
    return res.json(spotsData);
})

router.get('/current', async (req, res) => {
    const { user } = req;
    
    if (!user) return res.json({ user: null })
    
    const spots = await Spot.findAll({where: {ownerId: user.id}});
    
    for (let spot of spots) {
        const img = await SpotImage.findOne({
            where: {preview: true, spotId: spot.id}
        });
        const reviews = await Review.count({where: {spotId: spot.id}});
        const ratings = await Review.sum('stars', {where: {spotId: spot.id}});
        
        if (img) spot.previewImage = img.url;
        spot.avgRating = (ratings / reviews);
    }
    
    return res.json(spots);
});

router.get('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id, {
        attributes: {exclude: ['previewImage']},
        include: [
            {
                model: SpotImage, as: 'spotImages',
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User, as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });
    
    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    
    const spotData = spot.toJSON();
    const reviews = await Review.count({where: {spotId: spot.id}});
    const ratings = await Review.sum('stars', {where: {spotId: spot.id}});
    spotData.numReviews = reviews;
    spotData.avgStarRating = (ratings / reviews);
    
    return res.json(spotData);
})

const validateCreateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true })
      .withMessage('Longitude is not valid'),
    check('name')
      .isLength({ max:50 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('Price per day is required'),
    handleValidationErrors
  ]

router.post('/', validateCreateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    
    let { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        })
    }
    
    const newSpot = await Spot.create({
        ownerId: user.id, address, city, state, country, lat, lng, name, description, price
    });
    
    if (!newSpot) {
        return res.status(400).json({"message": "Failed to create new spot."});
    }
    
    const checkSpot = await Spot.findByPk(newSpot.id, {
        attributes: {exclude: ['previewImage', 'avgRating']}
    })
    
    return res.status(200).json(checkSpot);
})

router.delete('/:id', async (req, res) => {
    let { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        })
    }
    
    const spot = await Spot.findByPk(req.params.id);
    
    if (!spot) return res.status(404).json({"message": "Spot couldn't be found", "statusCode": 404});
    
    if (spot.ownerId !== user.id) return res.status(400).json({"message": "You do not have permission to delete that."});
    
    await spot.destroy();
    
    return res.json({"message": "Successfully deleted.", "statusCode": 200});
})


module.exports = router;
