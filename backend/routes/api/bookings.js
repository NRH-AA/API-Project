const express = require('express')
const router = express.Router();

const { Booking, Spot } = require('../../db/models');


router.get('/current', async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
    const bookings = await Booking.findAll({
        include: {
            model: Spot,
            attributes: {
                exclude: ['description', 'avgRating', 'createdAt', 'updatedAt']
            }
        },
        where: {userId: user.id}
    });
    
    return res.json(bookings);
});







module.exports = router;
