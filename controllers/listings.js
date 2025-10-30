const Listing = require("../models/listing");
const user = require("../models/user");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  const users = await user.find();
  res.render("listings/index", { allListings, users });
  };

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('reviews');
  const users = await user.find();
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  res.render("listings/show", { listing, users });
};

module.exports.createListing = async (req, res) => {

  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  await newListing.save();
  req.flash('success', 'Successfully created new listing!');
  res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const updatedData = { ...req.body };
  if (req.file) {
    updatedData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  await Listing.findByIdAndUpdate(req.params.id, updatedData);
  req.flash('success', 'Successfully updated listing!');
  res.redirect('/listings');
};

module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash('success', 'Successfully deleted listing!');
  res.redirect('/listings');
};