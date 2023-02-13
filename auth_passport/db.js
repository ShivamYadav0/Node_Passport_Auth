
var mongoose = require('mongoose');
const connectDB = async (DATABASE_URL) => {
  try {
    const DBoptions = {

    }
    console.log(DATABASE_URL)
    await mongoose.connect(DATABASE_URL, DBoptions)
    console.log("Connected Successfully...")
  }
  catch (err) {
    console.log("Error occurred !!")
  }
}

module.exports = { connectDB };