import express from "express"
const router=express.Router();

import UserController from "../controllers/userController.js"

//public routes
router.post('/register',UserController.userRegistration);




//protected routes


export default router;