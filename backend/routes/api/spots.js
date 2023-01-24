const express = require('express');
const router = express.Router();

const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const { Sequelize } = require('sequelize');

const { validateCreateSpot, validateSpotImage, validateReview } = require('./validations');

// Get all Spots
router.get('/', async (req, res) => {
    // const spots = await Spot.findAll({
    //     attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"], 'previewImage'],
    //     include: {model: Review, attributes: []}
    // });
    
    // for (let spot of spots) {
    //     spot.avgRating = Math.round(spot.avgRating);
    //     const previewImage = await SpotImage.findOne({where: {spotId: spot.id, preview: true}})
    //     spot.previewImage = previewImage && previewImage.url || "";
    // }
    
    const spots = await Spot.findAll();
    
    for (let spot of spots) {
        const reviewCount = await Review.count({where: {spotId: spot.id}});
        const reviewStars = await Review.sum('stars', {where: {spotId: spot.id}});
        spot.avgRating = Math.round(reviewStars / reviewCount);
    }
    
    res.json(spots);
})


// Get user spots
router.get('/current', async (req, res) => {
    const { user } = req;
    
    if (!user) return res.json({ user: null })
    
    const spots = await Spot.findAll({where: {ownerId: user.id}});
    
    for (let spot of spots) {
        const img = await SpotImage.findOne({
            where: {preview: true, spotId: spot.id}
        });
        const reviews = await Review.count({where: {spotId: spot.id}});
        const ratings = await Review.sum('stars', {where: {spotId: spot.id}});
        
        if (img) spot.previewImage = img.url;
        spot.avgRating = (ratings / reviews);
    }
    
    return res.json(spots);
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
router.post('/', validateCreateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    
    let { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        })
    }
    
    const newSpot = await Spot.create({
        ownerId: user.id, address, city, state, country, lat, lng, name, description, price
    });
    
    if (!newSpot) {
        return res.status(400).json({"message": "Failed to create new spot."});
    }
    
    const checkSpot = await Spot.findByPk(newSpot.id, {
        attributes: {exclude: ['previewImage', 'avgRating']}
    })
    
    return res.status(200).json(checkSpot);
})

// Edit Spot
router.patch('/:id', validateCreateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    
    let { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        })
    }
    
    const spot = await Spot.findByPk(req.params.id);
    
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    
    await spot.update({address, city, state, country, lat, lng, name, description, price});
    
    return res.json(spot);
})
router.put('/:id', validateCreateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    
    let { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        })
    }
    
    const spot = await Spot.findByPk(req.params.id);
    
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    
    await spot.update({address, city, state, country, lat, lng, name, description, price});
    
    return res.json(spot);
})

// Delete Spot
router.delete('/:id', async (req, res) => {
    let { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        })
    }
    
    const spot = await Spot.findByPk(req.params.id);
    
    if (!spot) return res.status(404).json({"message": "Spot couldn't be found", "statusCode": 404});
    
    if (spot.ownerId !== user.id) return res.status(400).json({"message": "You do not have permission to delete that."});
    
    await spot.destroy();
    
    return res.json({"message": "Successfully deleted.", "statusCode": 200});
})

// Add Image to Spot Id
router.post('/:id/images', validateSpotImage, async (req, res) => {
    let { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
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
    spotImages.preview = false;
    await spotImages.save();
    
    const newImage = await SpotImage.create({
        spotId: req.params.id,
        url,
        preview
    });
    
    await spot.save();
    
    return res.status(200).json(newImage);
});

router.delete('/:spotId/images/:imageId', async (req, res) => {
    let { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
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

router.post('/:spotId/reviews', validateReview, async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(400).json({
            "message": "Authorization Error",
            "errors": "You must be logged in!"
        });
    };
    
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(400).json({
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
    
    
    return res.status(200).json(newReview);
});

router.get('/:spotId/reviews', async (req, res) => {
    const reviews = await Review.findAll({
        where: {spotId: req.params.spotId},
        include: {
            model: ReviewImage,
            attributes: ['id', 'url']
        }
    });
    
    const reviewsJsons = [];
    for (let review of reviews) {
        const reviewJson = review.toJSON();
        reviewJson.User = await User.findByPk(review.userId, {
            attributes: ['id', 'firstName', 'lastName']
        });
        reviewsJsons.push(reviewJson);
    };
    
    return res.json(reviewsJsons);
});

module.exports = router;
