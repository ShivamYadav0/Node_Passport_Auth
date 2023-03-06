const mongoose = require('mongoose')


const collect = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const User = mongoose.models.User || mongoose.model("User", collect)


module.exports = { User };