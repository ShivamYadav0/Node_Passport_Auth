import express from "express"
import web from "./routes/web.js"
import connectDB from "./db/connectDB.js"
import {join} from "path"

const app=express() 
const port=process.env.PORT|| 3000
const DATABASE_URL =process.env.DATABASE_URL
"mongodb://localhost:27017"

connectDB(DATABASE_URL);
app.set("view engine","ejs")
app.use("/",web); 
app.use(express.static(path.join(process.cwd(),'public')))

app.listen(port)