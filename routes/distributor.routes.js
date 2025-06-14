import { Router } from "express";
import { distributorSignup, distributorLogin, authenticateDistributorJWT, DistributorLogout, getToken } from "../controllers/destributor.controller.js";
import { registerRestaurant, registerItem, getRestaurant, getRestaurantWithItems, getRegisteredRestaurant } from "../controllers/restaurant.controller.js";
import { upload } from "../utils/multer.js";
import { editRestaurant } from "../controllers/destributor.controller.js";
const DistributorRouter=Router();

DistributorRouter.route('/register').post(distributorSignup);
DistributorRouter.route('/login').post(distributorLogin);
DistributorRouter.route('/auth').post(authenticateDistributorJWT);
DistributorRouter.route('/logout').post(DistributorLogout);
DistributorRouter.route('/get-user-type-token').post(getToken);
DistributorRouter.route('/get-restaurant').post(getRestaurant);
DistributorRouter.route('/get-registered-restaurant').post(getRegisteredRestaurant);
DistributorRouter.route('/get-restaurant-dish/:resId').post(getRestaurantWithItems);


// DistributorRouter.route('/get-res-info').post(getImageRestaurant);
DistributorRouter.route('/register-restaurant').post( upload.single('resimage'),registerRestaurant);
DistributorRouter.route('/register-restaurant-dish/:resId').post( upload.single('itemimage'),registerItem);

DistributorRouter.route('/edit-restaurant').post(upload.single('resimage'),editRestaurant)
export default DistributorRouter;