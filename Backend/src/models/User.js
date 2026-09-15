const mongoose = require('mongoose');

// TODO: define the User schema (fullName, email, password, role, etc.)
// See package.json — bcryptjs is already installed for password hashing.
const userSchema = new mongoose.Schema(
  {
    // TODO: add fields
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
