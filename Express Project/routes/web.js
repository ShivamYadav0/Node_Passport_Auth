
import express from "express"

import loginController from "./controllers/loginController.js"
import registerController from "./controllers/registerController.js"
import dbs from "./controllers/dbs.js"
const router =express.router()

router.get("/login",loginController)
router.get("/register",registerController)


export default router;