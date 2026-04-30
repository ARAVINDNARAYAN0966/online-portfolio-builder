const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  role: { type: String, required: true },
  industry: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  linkedin: { type: String },
  github: { type: String },
  phone: { type: String },
  borderColor: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Creator', creatorSchema);
