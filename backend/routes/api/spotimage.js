const express = require('express')
const router = express.Router();

const { requireAuth } = require('../../utils/auth');

const { Spot, SpotImage } = require('../../db/models');

// Delete a spot image
router.delete('/:id', requireAuth, async (req, res, next) => {
    const { user } = req;
    
    const spotImage = await SpotImage.findByPk(req.params.id);
    if (!spotImage) {
        return res.status(404).json({
            "message": "Spot image couldn't be found",
            "statusCode": 404
        });
    };
    
    const spot = await Spot.findByPk(spotImage.spotId);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot image is not longer valid",
            "statusCode": 404
        });
    };
    
    if (spot.ownerId !== user.id) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You can only delete your own spots image!"
        });
    };
    
    await spotImage.destroy();
    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
});

module.exports = router;
