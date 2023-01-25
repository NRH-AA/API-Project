const express = require('express')
const router = express.Router();

const { ReviewImage } = require('../../db/models');


router.delete('/:id', async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
    const reviewImage = await ReviewImage.findByPk(req.params.id);
    if (!reviewImage) {
        return res.status(404).json({
            "message": "Review image couldn't be found",
            "statusCode": 404
        });
    };
    
    if (reviewImage.userId !== user.id) {
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
