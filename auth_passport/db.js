
var mongoose = require('mongoose');
const connectDB = async (DATABASE_URL) => {
  try {
    const DBoptions = {

    }
    await mongoose.connect(DATABASE_URL, DBoptions)

    console.log("Connected Successfully...");
    return 1;
  }
  catch (err) {

    console.log("Error occurred !!");
    return 0;
  }
}

module.exports = { connectDB };