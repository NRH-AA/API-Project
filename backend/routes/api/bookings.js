const express = require('express')
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { validateBooking } = require('./validations');

const { Booking, Spot, SpotImage, Review } = require('../../db/models');
const { Op } = require('sequelize');

// Get users bookings
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    
    const bookings = await Booking.findAll({
        include: {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            }
        },
        where: {userId: user.id}
    });
    
    for (let booking of bookings) {
        const reviewsCount = await Review.count({where: {spotId: booking.Spot.id}});
        
        if (!reviewsCount) {
            booking.Spot.avgRating = "0.0"
        } else {
            const ratings = await Review.sum('stars', {where: {spotId: booking.Spot.id}});
            booking.Spot.avgRating = (ratings / reviewsCount).toPrecision(2);
        }
        
        const spotImages = await SpotImage.findOne({
            where: {
                spotId: booking.Spot.id,
                preview: true
            }
        });
        
        if (!spotImages) booking.Spot.previewImage = "None"
        else booking.Spot.previewImage = spotImages.toJSON().url;
    }
    
    return res.status(200).json({"Bookings": bookings});
});

// router.get('/:id', async (req, res) => {
//     const booking = await Booking.findByPk(req.params.id);
//     res.json(booking);
// });

// Edit a booking
router.put('/:id', requireAuth, validateBooking, async (req, res, next) => {
    const { user } = req;
    
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
            spotId: booking.spotId,
            startDate: {[Op.gte]: startDate},
            endDate: {[Op.lte]: endDate}
        }
    });
    
    for (let book of bookings) {
        if (book.id !== booking.id) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            });
        };
    };
    
    await booking.update({
        startDate,
        endDate
    });
    
    return res.status(200).json(booking);
});
router.patch('/:id', requireAuth, validateBooking, async (req, res, next) => {
    const { user } = req;
    
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
            spotId: booking.spotId,
            startDate: {[Op.gte]: startDate},
            endDate: {[Op.lte]: endDate}
        }
    });
    
    for (let book of bookings) {
        if (book.id !== req.params.id) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            });
        };
    };
    
    await booking.update({
        startDate,
        endDate
    });
    
    return res.status(200).json(booking);
});

// Delete a booking
router.delete('/:id', requireAuth, async (req, res, next) => {
    const { user } = req;
    
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
            "errors": "You can only delete your own bookings"
        });
    };
    
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
