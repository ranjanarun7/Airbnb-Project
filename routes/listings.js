const express = require('express');
const router = express.Router();
const { isLoggedIn, isOwner } = require('../middleware');
const listingsController = require('../controllers/listings');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

// List all listings

// Create new listing
router.route('/')
.get(listingsController.index)
.post(isLoggedIn, upload.single('image'), listingsController.createListing);

// Render form to create new listing
router.get('/new', isLoggedIn, listingsController.renderNewForm);

// Show, update, and delete specific listing
router.route('/:id')
.get(listingsController.showListing)
.put(isLoggedIn, isOwner,
  upload.single('image'),
  listingsController.updateListing)
.delete(isLoggedIn, isOwner, listingsController.deleteListing);

router.get('/:id/edit', isLoggedIn, listingsController.renderEditForm);

module.exports = router;