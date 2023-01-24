const express = require('express')
const router = express.Router();

const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { validateReview } = require('./validations');

router.get('/current', async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        })
    }
    
    const reviews = await Review.findAll({
        where: {userId: user.id},
        include: [
            {
                model: Spot,
                attributes: {exclude: ['createdAt', 'updatedAt']}
            },
            {
                model: ReviewImage,
                attributes: {exclude: ['createdAt', 'updatedAt', 'reviewId']}
            }
        ]
    });
    
    return res.json(reviews);
});

router.post('/:spotId', validateReview, async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(400).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };
    
    if (spot.ownerId === user.id) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You cannot review your own spot."
        });
    };
    
    const { review, stars } = req.body;
    
    const newReview = await Review.create({
        userId: user.id,
        spotId: spot.id,
        review,
        stars
    });
    
    
    return res.status(200).json(newReview);
});

router.get('/:spotId', async (req, res) => {
    const reviews = await Review.findAll({
        where: {spotId: req.params.spotId},
        include: {
            model: ReviewImage,
            attributes: ['id', 'url']
        }
    });
    
    const reviewsJsons = [];
    for (let review of reviews) {
        const reviewJson = review.toJSON();
        reviewJson.User = await User.findByPk(review.userId, {
            attributes: ['id', 'firstName', 'lastName']
        });
        reviewsJsons.push(reviewJson);
    };
    
    return res.json(reviewsJsons);
});


module.exports = router;
