import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import { userDetailController } from "../../controllers/users/detail-controller.js";


const userDetailRouter = Router();

userDetailRouter.post('/user-detail/:userId',checkAuth, userDetailController);


export default userDetailRouter;