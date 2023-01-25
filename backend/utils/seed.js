const bcrypt = require("bcryptjs");
const { faker } = require('@faker-js/faker');
const rNum = (num) => Math.floor(Math.random() * Math.floor(num) + 1);

const seedUsers = num => {
    const users = new Array(num).fill('');
    
    for (let i in users) {
        users[i] = {
            email: faker.internet.email(),
            username: faker.internet.userName(),
            hashedPassword: bcrypt.hashSync(faker.internet.password()),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        };
    };
    
    return users;
}

const seedSpots = num => {
    const spots = new Array(num).fill('');
    
    for (let i in spots) {
        spots[i] = {
            ownerId: rNum(100),
            address: faker.address.streetAddress(),
            city: faker.address.cityName(),
            state: faker.address.state(),
            country: faker.address.country(),
            lat: faker.address.latitude(),
            lng: faker.address.longitude(),
            name: faker.word.adjective() + ' ' + faker.word.noun({length: { min: 5, max: 8}}),
            description: faker.lorem.paragraph(),
            price: faker.datatype.number({ min: 50, max: 300})
        };
    };
    
    return spots;
}

const seedSpotImages = num => {
    const spotImages = new Array(num).fill('');
    
    for (let i in spotImages) {
        spotImages[i] = {
            spotId: rNum(100),
            url: faker.image.imageUrl(),
            preview: false
        };
    };
    
    return spotImages;
}

const seedReviews = num => {
    const reviews = new Array(num).fill('');
    
    for (let i in reviews) {
        reviews[i] = {
            spotId: rNum(100),
            userId: rNum(100),
            review: faker.lorem.paragraph(),
            stars: rNum(5)
        };
    };
    
    return reviews;
}

const seedReviewImages = num => {
    const reviewImages = new Array(num).fill('');
    
    for (let i in reviewImages) {
        reviewImages[i] = {
            reviewId: rNum(200),
            url: faker.image.imageUrl()
        };
    };
    
    return reviewImages;
}

const seedBookings = num => {
    const bookings = new Array(num).fill('');
    
    for (let i in bookings) {
        bookings[i] = {
            spotId: rNum(100),
            userId: rNum(100),
            startDate: faker.date.between('2023-02-01', '2023-02-03'),
            endDate: faker.date.between('2023-02-04', '2023-02-07')
        };
    };
    
    return bookings;
}


module.exports = {
    seedUsers,
    seedSpots,
    seedSpotImages,
    seedReviews,
    seedReviewImages,
    seedBookings
}
