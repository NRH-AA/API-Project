const express = require('express')
const router = express.Router();

const { Review, User, Spot, ReviewImage } = require('../../db/models');

router.get('/current', async (req, res) => {
    const { user } = req;
    
    if (!user) return res.json({ user: null })
    
    const reviews = await Review.findAll({
        where: {userId: user.id},
        include: [
            {
                model: Spot,
                attributes: {exclude: ['createdAt', 'updatedAt']}
            },
            {
                model: ReviewImage,
                attributes: {exclude: ['createdAt', 'updatedAt', 'reviewId']}
            }
        ]
    });
    
    return res.json(reviews);
});


module.exports = router;
