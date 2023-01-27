const express = require('express')
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { validateReview, validateReviewImage } = require('./validations');

const { Review, Spot, ReviewImage, SpotImage } = require('../../db/models');

// Get users reviews
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    
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
    
    for (let review of reviews) {
        const reviewsCount = await Review.count({where: {spotId: review.Spot.id}});
        
        if (!reviewsCount) {
            review.Spot.avgRating = "0.0"
        } else {
            const ratings = await Review.sum('stars', {where: {spotId: review.Spot.id}});
            review.Spot.avgRating = (ratings / reviewsCount).toPrecision(2);
        }
        
        const spotImages = await SpotImage.findOne({
            where: {
                spotId: review.Spot.id,
                preview: true
            }
        });
        
        if (!spotImages) review.Spot.previewImage = "None"
        else review.Spot.previewImage = spotImages.toJSON().url;
    }
    
    return res.status(200).json({"Reviews": reviews});
});

// Edit a review
router.put('/:id', requireAuth, validateReview, async (req, res, next) => {
    const { user } = req;
    
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
router.patch('/:id', requireAuth, validateReview, async (req, res, next) => {
    const { user } = req;
    
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

// Delete a review
router.delete('/:id', requireAuth, async (req, res, next) => {
    const { user } = req;
    
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
            "errors": "You may only delete your own reviews"
        });
    };
    
    await reviewItem.destroy();
    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
});

// Add image to a review
router.post('/:id/images', requireAuth, validateReviewImage, async (req, res, next) => {
    const { user } = req;
    
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
            "errors": "You may only add images to your own review"
        });
    };
    
    const imageCount = await ReviewImage.count({where: {reviewId: reviewItem.id}});
    if (imageCount >= 10) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
        });
    };
    
    const { url } = req.body;
    
    await ReviewImage.create({reviewId: req.params.id, url});
    
    const imageData = await ReviewImage.findOne({
        attributes: ['id', 'url'],
        order: [['id', 'DESC']]
    });
    
    return res.status(200).json(imageData);
});


module.exports = router;
