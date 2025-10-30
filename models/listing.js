const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: String,
    filename: String
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  owner:{ type: Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, enum: ['Beach', 'Mountain', 'Iconic Cities', 'Castles', 'Nature', 'Forest', 'Amazing Pools','Rooms'], }
});

listingSchema.post('findOneAndDelete', async function(listing){
  await Review.deleteMany({ _id: { $in: listing.reviews } });
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
