const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Please add a full name'] },
  email: { type: String, required: true, unique: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'] },
  password: { type: String, required: true, minlength: 6, select: false },
  admissionNumber: { type: String, required: [true, 'Please add an admission number'] },
  dateOfBirth: { type: Date, required: [true, 'Please add your date of birth'] },
  profilePicture: { type: String, default: 'no-photo.jpg' },
  bio: { type: String, maxlength: 500 },
  batchYear: { type: Number, required: [true, 'Please add a batch year'] },
  currentOrganization: { type: String },
  location: { type: String },
  linkedInProfile: { type: String },
  instagramProfile: { type: String },
  facebookProfile: { type: String },
  phoneNumber: { type: String },
  role: { type: String, enum: ['alumni', 'admin'], default: 'alumni' },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
