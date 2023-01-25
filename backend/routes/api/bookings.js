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

// router.get('/:id', async (req, res) => {
//     const booking = await Booking.findByPk(req.params.id);
//     res.json(booking);
// });

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
    
    if (startDate >= endDate) {
        return res.status(400).json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        });
    };
    
    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId,
            startDate: {[Op.gte]: startDate},
            endDate: {[Op.lte]: endDate}
        }
    });
    
    if (bookings.length) {
        return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "statusCode": 403,
            "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
            }
        });
    };
    
    await booking.update({
        startDate,
        endDate
    });
    
    return res.status(200).json(booking);
});
router.patch('/:id', validateBooking, async (req, res) => {
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
            "message": "Start date has already passed",
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

router.delete('/:id', async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        });
    };
    
    // if (booking.userId !== user.id) {
    //     return res.status(400).json({
    //         "message": "Validation error",
    //         "errors": "You can only delete your own bookings"
    //     });
    // };
    
    const today = new Date();
    if (booking.startDate <= today) {
        return res.status(403).json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 403
        });
    };
    
    await booking.destroy();
    
    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
});


module.exports = router;
