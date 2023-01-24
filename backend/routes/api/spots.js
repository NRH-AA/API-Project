const express = require('express');
const router = express.Router();

const { User, Spot, SpotImage, Review } = require('../../db/models');
const { Sequelize } = require('sequelize');


// Get all Spots
router.get('/', async (req, res) => {
    // const spots = await Spot.findAll({
    //     attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"], 'previewImage'],
    //     include: {model: Review, attributes: []}
    // });
    
    // for (let spot of spots) {
    //     spot.avgRating = Math.round(spot.avgRating);
    //     const previewImage = await SpotImage.findOne({where: {spotId: spot.id, preview: true}})
    //     spot.previewImage = previewImage && previewImage.url || "";
    // }
    
    const spots = await Spot.findAll({
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price'],
    });
    
    for (let spot of spots) {
        const reviewCount = await Review.count({where: {spotId: spot.id}});
        const reviewStars = await Review.sum('stars', {where: {spotId: spot.id}});
        spot.avgRating = Math.round(reviewStars / reviewCount);
        
        const previewImage = await SpotImage.findOne({where: {spotId: spot.id, preview: true}})
        spot.previewImage = previewImage && previewImage.url || "";
    }
    
    res.json(spots);
})


// Get user spots
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


// Get Spot by ID
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

// Create Spot
const { validateCreateSpot } = require('./validations');
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

// Edit Spot
router.patch('/:id', validateCreateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    
    let { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        })
    }
    
    const spot = await Spot.findByPk(req.params.id);
    
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    
    await spot.update({address, city, state, country, lat, lng, name, description, price});
    
    return res.json(spot);
})

// Delete Spot
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
