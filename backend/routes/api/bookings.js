const express = require('express')
const router = express.Router();

const { Booking, Spot } = require('../../db/models');
const { validateBooking } = require('./validations');

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

router.put('/:id', validateBooking, async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
    let { startDate, endDate } = req.body;
    
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        });
    };
    
    if (booking.userId !== user.id) {
        return res.status(400).json({
            "message": "Validation error",
            "errors": "You can only edit your own bookings"
        });
    };
    
    const today = new Date();
    if (booking.endDate <= today) {
        return res.status(403).json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        });
    };
    
    if (booking.startDate <= today && startDate !== booking.startDate) {
        return res.status(403).json({
            "message": "Start date has already passed.",
            "statusCode": 403
        });
    };
    
    if (endDate <= today) {
        return res.status(403).json({
            "message": "End date must be in the future",
            "statusCode": 403
        });
    };
    
    await booking.update({
        startDate,
        endDate
    });
    
    return res.status(200).json(booking);
});





module.exports = router;
