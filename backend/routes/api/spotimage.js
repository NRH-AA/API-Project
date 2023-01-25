const express = require('express')
const router = express.Router();

const { SpotImage } = require('../../db/models');

router.delete('/:id', async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
    const spotImage = await SpotImage.findByPk(req.params.id);
    if (!spotImage) {
        return res.status(404).json({
            "message": "Spot image couldn't be found",
            "statusCode": 404
        });
    };
    
    if (spotImage.userId !== user.id) {
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
