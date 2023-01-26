const express = require('express')
const router = express.Router();

const { requireAuth } = require('../../utils/auth');

const { Review, ReviewImage } = require('../../db/models');

// Delete a review image
router.delete('/:id', requireAuth, async (req, res, next) => {
    const { user } = req;
    
    const reviewImage = await ReviewImage.findByPk(req.params.id);
    if (!reviewImage) {
        return res.status(404).json({
            "message": "Review image couldn't be found",
            "statusCode": 404
        });
    };
    
    const review = await Review.findByPk(reviewImage.reviewId);
    if (!review) {
        return res.status(404).json({
            "message": "Review image is not longer valid",
            "statusCode": 404
        });
    };
    
    if (review.userId !== user.id) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You can only delete your own review image!"
        });
    };
    
    await reviewImage.destroy();
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
});


module.exports = router;
