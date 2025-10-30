const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');
const { createReview, deleteReview } = require('../controllers/reviews');



// list a review for a listing

router.post('/', isLoggedIn, wrapAsync(createReview));


router.delete('/:reviewId', isLoggedIn, wrapAsync(deleteReview));
module.exports = router;