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
    
    let id = 1;
    for (let i in spots) {
        spots[i] = {
            ownerId: id,
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
        id++;
    };
    
    return spots;
}

const seedSpotImages = num => {
    const spotImages = new Array(num).fill('');
    
    let id = 1;
    for (let i in spotImages) {
        spotImages[i] = {
            spotId: id,
            url: faker.image.business(),
            preview: true
        };
        id++;
    };
    
    return spotImages;
}

const seedReviews = num => {
    const reviews = new Array(num).fill('');
    
    let id = 1;
    for (let i in reviews) {
        reviews[i] = {
            spotId: id,
            userId: rNum(5),
            review: faker.lorem.paragraph(),
            stars: rNum(5)
        };
        id++;
    };
    
    return reviews;
}

const seedReviewImages = num => {
    const reviewImages = new Array(num).fill('');
    
    let id = 1;
    for (let i in reviewImages) {
        reviewImages[i] = {
            reviewId: id,
            url: faker.image.imageUrl()
        };
        id++;
    };
    
    return reviewImages;
}

const seedBookings = num => {
    const bookings = new Array(num).fill('');
    
    let id = 1;
    for (let i in bookings) {
        bookings[i] = {
            spotId: id,
            userId: rNum(5),
            startDate: faker.date.between('2023-02-01', '2023-02-03'),
            endDate: faker.date.between('2023-02-04', '2023-02-07')
        };
        id++;
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
