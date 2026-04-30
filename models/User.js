const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  industry: String,
  service: String,
  bio: String,
  skills: [String],
  colorTheme: { type: String, default: 'Purple' },
  country: { type: String },
  avatar: String,
  isPublished: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: String,
  address: String,
  linkedin: String,
  github: String,
  portfolio: PortfolioSchema
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
