import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  day: Number,
  title: String,
  description: String,
  activities: [String],
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  date: String,
}, { _id: false });

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
}, { _id: false });

const travelPackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: String,
  duration: String,
  price: Number,
  rating: Number,
  reviewCount: Number,
  description: String,
  image: String,
  highlights: [String],
  itinerary: [itinerarySchema],
  inclusions: [String],
  exclusions: [String],
  reviews: [reviewSchema],
  faqs: [faqSchema],
}, { timestamps: true });

const TravelPackage = mongoose.model('TravelPackage', travelPackageSchema);

export { TravelPackage };
export default TravelPackage;