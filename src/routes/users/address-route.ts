import { Router } from "express";
import { userDetailController } from "../../controllers/users/detail-controller.js";

const userDetailRouter: Router = Router();

// User address routes
userDetailRouter.post('/address/:userId', userDetailController);

// TODO: Add user address routes here
// userDetailRouter.get('/addresses', getUserAddresses);
// userDetailRouter.post('/addresses', createAddress);
// userDetailRouter.put('/addresses/:id', updateAddress);
// userDetailRouter.delete('/addresses/:id', deleteAddress);

export default userDetailRouter; 