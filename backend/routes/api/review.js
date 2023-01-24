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

router.put('/:id', validateReview, async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
    const reviewItem = await Review.findByPk(req.params.id);
    if (!reviewItem) {
        return res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        });
    };
    
    if (reviewItem.userId !== user.id) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You may only edit your own reviews"
        });
    };
    
    const { review, stars } = req.body;
    
    await reviewItem.update({review, stars});
    return res.status(200).json(reviewItem);
});


module.exports = router;
