

import mongoose from "mongoose" 

const connectDB= async (DATABASE_URL)=>{
  try{
    const DBoptions={
      
    }
    await mongoose.connect(DATABASE_URL,DBoptions)
    console.log("Connected Successfully...")
  }
  catch(err){
    console.log("Error occurred !!")
  }
}

export {connectDB}