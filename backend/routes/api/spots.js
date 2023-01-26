const express = require('express');
const router = express.Router();

const { Sequelize, Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const { // Validations
    validateCreateSpot, 
    validateSpotImage, 
    validateReview, 
    validateBooking,
    validateGetSpots
} = require('./validations');

// Get all Spots
router.get('/', validateGetSpots, async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;
    if (isNaN(page) || page === 0) page = 1;
    if (isNaN(size) || size === 0) size = 20;
    
    const pagination = {};
    pagination.limit = size;
    pagination.offset = size * (page - 1);
    
    const where = {};
    if (minLat) where.lat = {[Op.gte]: Number(minLat)};
    if (maxLat) where.lat = {...where.lat, [Op.lte]: Number(maxLat)};
    if (minLng) where.lng = {[Op.gte]: Number(minLng)};
    if (maxLng) where.lng = {...where.lng, [Op.lte]: Number(maxLng)};
    if (minPrice) where.price = {[Op.gte]: Number(minPrice)};
    if (maxPrice) where.price = {...where.price, [Op.lte]: Number(maxPrice)};
    
    // const spots = await Spot.findAll({
    //     attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"], 'previewImage'],
    //     include: {model: Review, attributes: []}
    // });
    
    // for (let spot of spots) {
    //     spot.avgRating = Math.round(spot.avgRating);
    // }
    
    const spots = await Spot.findAll({
        where,
        ...pagination
    });
    
    for (let spot of spots) {
        const reviews = await Review.count({where: {spotId: spot.id}});
        
        if (!reviews) {
            spot.avgRating = "0.0"
        } else {
            const ratings = await Review.sum('stars', {where: {spotId: spot.id}});
            spot.avgRating = (ratings / reviews).toPrecision(2);
        }
        
        const spotImages = await SpotImage.findOne({
            where: {preview: true}
        });
        
        if (!spotImages) spot.previewImage = "None"
        else spot.previewImage = spotImages.toJSON().url;
    };
    
    return res.status(200).json({"Spots": spots});
})


// Get user spots
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    
    const spots = await Spot.findAll({where: {ownerId: user.id}});
    
    for (let spot of spots) {
        const reviews = await Review.count({where: {spotId: spot.id}});
        
        if (!reviews) {
            spot.avgRating = "0.0"
        } else {
            const ratings = await Review.sum('stars', {where: {spotId: spot.id}});
            spot.avgRating = (ratings / reviews).toPrecision(2);
        }
        
        const spotImages = await SpotImage.findOne({
            where: {
                spotId: spot.id,
                preview: true
            }
        });
        
        if (!spotImages) spot.previewImage = "None"
        else spot.previewImage = spotImages.toJSON().url;
    }
    
    return res.status(200).json({"Spots": spots});
});


// Get Spot by ID
router.get('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id, {
        attributes: {exclude: ['previewImage']},
        // include: [
        //     {
        //         model: SpotImage, as: 'spotImages',
        //         attributes: ['id', 'url', 'preview']
        //     },
        //     {
        //         model: User, as: 'Owner',
        //         attributes: ['id', 'firstName', 'lastName']
        //     }
        // ]
    });
    
    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    
    const spotData = spot.toJSON();
    const reviews = await Review.count({where: {spotId: spot.id}});
    const ratings = await Review.sum('stars', {where: {spotId: spot.id}});
    spotData.numReviews = reviews;
    spotData.avgStarRating = (ratings / reviews);
    
    spotData.SpotImage = await SpotImage.findAll({
        attributes: ['id', 'url', 'preview'],
        where: {spotId: req.params.id}
    });
    spotData.Owner = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    });
    
    return res.json(spotData);
})

// Create Spot
router.post('/', requireAuth, validateCreateSpot, async (req, res, next) => {
    const { user } = req;
    
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    
    const newSpot = await Spot.create({
        ownerId: user.id, address, city, state, country, lat, lng, name, description, price
    });
    
    if (!newSpot) {
        return res.status(400).json({"message": "Failed to create new spot."});
    }
    
    const checkSpot = await Spot.findByPk(newSpot.id, {
        attributes: {exclude: ['previewImage', 'avgRating']}
    })
    
    return res.status(201).json(checkSpot);
})

// Edit Spot
router.patch('/:id', requireAuth, validateCreateSpot, async (req, res, next) => {
    const { user } = req;
    
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    
    const spot = await Spot.findByPk(req.params.id);
    
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };
    
    if (spot.ownerId !== user.id) {
        return res.status(400).json({
            "message": "You may only edit your own spots",
            "statusCode": 400
        });
    };
    
    await spot.update({address, city, state, country, lat, lng, name, description, price});
    
    const updatedSpot = await Spot.findByPk(spot.id, {
        attributes: {exclude: ['avgRating', 'previewImage']}
    });
    
    return res.json(updatedSpot);
})
router.put('/:id', requireAuth, validateCreateSpot, async (req, res, next) => {
    const { user } = req;
    
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    
    const spot = await Spot.findByPk(req.params.id);
    
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };
    
    if (spot.ownerId !== user.id) {
        return res.status(400).json({
            "message": "You may only edit your own spots",
            "statusCode": 400
        });
    };
    
    await spot.update({address, city, state, country, lat, lng, name, description, price});
    
    const updatedSpot = await Spot.findByPk(spot.id, {
        attributes: {exclude: ['avgRating', 'previewImage']}
    });
    
    return res.json(updatedSpot);
})

// Delete Spot
router.delete('/:id', requireAuth, async (req, res, next) => {
    const { user } = req;
    
    const spot = await Spot.findByPk(req.params.id);
    
    if (!spot) return res.status(404).json({"message": "Spot couldn't be found", "statusCode": 404});
    
    if (spot.ownerId !== user.id) return res.status(400).json({"message": "You do not have permission to delete that."});
    
    await spot.destroy();
    
    return res.json({"message": "Successfully deleted.", "statusCode": 200});
})

// Add Image to Spot Id
router.post('/:id/images', requireAuth, validateSpotImage, async (req, res, next) => {
    const { user } = req;
    
    let { url, preview } = req.body;
    
    const spot = await Spot.findByPk(req.params.id);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };
    
    if (spot.ownerId != user.id) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must own the spot!"
        });
    };
    
    
    if (preview) {
        spot.previewImage = url;
        preview = true;
    };
    
    if (!preview) preview = false;
    
    const spotImages = await SpotImage.findOne({where: {spotId: req.params.id, preview: true}});
    if (spotImages) {
        spotImages.preview = false;
        await spotImages.save();
    };
    
    const newImage = await SpotImage.create({
        spotId: req.params.id,
        url,
        preview
    });
    
    await spot.save();
    
    return res.status(200).json(newImage);
});

// Delete image from spot
router.delete('/:spotId/images/:imageId', requireAuth, async (req, res, next) => {
    const { user } = req;
    
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };
    
    if (spot.ownerId != user.id) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must own the spot!"
        });
    };
    
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    if (!spotImage) {
        return res.status(404).json({
            "message": "Spot image couldn't be found",
            "statusCode": 404
        });
    };
    
    await spotImage.destroy();
    
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
});

// Add review to spot
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const { user } = req;
    
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };
    
    if (spot.ownerId === user.id) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You cannot review your own spot."
        });
    };
    
    const { review, stars } = req.body;
    
    const newReview = await Review.create({
        userId: user.id,
        spotId: spot.id,
        review,
        stars
    });
    
    
    return res.status(201).json(newReview);
});

// Get spot reviews
router.get('/:spotId/reviews', async (req, res) => {
    const reviews = await Review.findAll({
        where: {spotId: req.params.spotId},
        include: {
            model: ReviewImage,
            attributes: ['id', 'url']
        }
    });
    
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    };
    
    const reviewsJsons = [];
    for (let review of reviews) {
        const reviewJson = review.toJSON();
        reviewJson.User = await User.findByPk(review.userId, {
            attributes: ['id', 'firstName', 'lastName']
        });
        reviewsJsons.push(reviewJson);
    };
    
    return res.status(200).json({"Reviews": reviewsJsons});
});

// Get spot bookings
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { user } = req;
    
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    }
    
    let attributes;
    const include = {};
    if (spot.ownerId === user.Id) {
        include.model = User
        include.attributes = ['id', 'firstName', 'lastName'];
    } else {
        attributes = ['id', 'startDate', 'endDate'];
    }
    
    const bookings = await Booking.findAll({
        attributes,
        ...include,
        where: {spotId: req.params.spotId}
    });
    
    return res.status(200).json({"Bookings": bookings});
});

// Create new booking
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const { user } = req;
    
    let { startDate, endDate } = req.body;
    
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    
    if (!startDate || !endDate) {
        return res.status(400).json({
            "message": "Validation error",
            "errors": "Start or end date is invalid"
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
    
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
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
    
    const booking = await Booking.create({
        spotId: req.params.spotId,
        userId: user.id,
        startDate,
        endDate
    });
    
    return res.status(200).json(booking);
});

module.exports = router;
