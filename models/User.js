const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  websiteLink: String
});

const PortfolioSchema = new mongoose.Schema({
  industry: String,
  service: String,
  bio: String,
  skills: [String],
  colorTheme: { type: String, default: 'purple' },
  avatar: String,
  projects: [ProjectSchema]
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: String,
  address: String,
  linkedin: String,
  github: String,
  website: String,
  portfolio: PortfolioSchema
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
