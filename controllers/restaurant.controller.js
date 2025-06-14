import Restaurant from "../models/restaurant.model.js";
import { Item } from "../models/restaurant.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Distributor from '../models/distributor.model.js'
import jwt from "jsonwebtoken";

const getDistributorId = (req) => {
    if (!req.cookies || !req.cookies.distributorToken) {
        return null;
    }
    try {
        const encodedDistributorToken = req.cookies.distributorToken;
        const decodedDistributorToken = jwt.verify(encodedDistributorToken, process.env.JWT_SECRET);
        const distributorId = decodedDistributorToken.id;
        return distributorId;
    } catch (error) {
        console.error("Error decoding distributor token:", error.message);
        return null;
    }
}

const registerRestaurant = async (req, res) => {
    const { resid, resname, reslocation, resdescription, restype, resowner, resopentime, resclosetime } = req.body;

    const resImageLocalPath = req.file ? req.file.path : null;

    try {
        if (!resid || !resname || !reslocation || !restype || !resowner || !resopentime || !resclosetime) {
            return res.status(400).json({
                success: false,
                message: `${!resid ? "Restaurant Id" : !resname ? "Restaurant Name" : !reslocation ? "Location" : !restype ? "Image" : !resowner ? "Owner" : !resopentime ? "Open Time" : "Close Time"} is required`,
            });
        }

        if (!resImageLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Upload the restaurant Photo",
            })
        }

        const isexistRestaurant = await Restaurant.findOne({ resid });
        if (isexistRestaurant) {
            return res.status(400).json({
                success: false,
                message: "Restaurant is already Registered",
            });
        }

        const uploadResImageResponse = await uploadOnCloudinary(resImageLocalPath);
        if (!uploadResImageResponse) {
            return res.status(500).json({
                success: false,
                message: "File is not uploaded on Cloudinary",
            })
        }

        const isDisdtributorLoggedIn = getDistributorId(req);
        if (isDisdtributorLoggedIn) {
            const newRestaurant = new Restaurant({ resid, resname, reslocation, resdescription, restype, resowner, resopentime, resclosetime, resimage: uploadResImageResponse.url });
            const saveToDB = await newRestaurant.save();
            const upadateDistributor = await Distributor.findOneAndUpdate({ _id: isDisdtributorLoggedIn }, { $push: { restaurant: resid } }, { new: true });
            if (!saveToDB) {
                return res.status(500).json({
                    success: false,
                    message: "Restaurant Data is not saved to Database",
                })
            }
        } else {
            return res.status(500).json({
                success: false,
                message: "You are not logged In",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Restaurant registered Succesfully",
        })
    } catch (error) {
        console.log("Error in Register the restaurant", error.message);
        return res.status(500).json({
            success: false,
            message: "Restaurant is not registered Succesfully",
        })
    }
}

const registerItem = async (req, res) => {
    const { itemname, itemdescription, itemprice} = req.body;
    const itemImageLocalPath = req.file ? req.file.path : null;

    try {

        if (!itemname || !itemprice) {
            return res.status(400).json({
                success: false,
                message: `${!itemname ? "Item Name" :  "Item Price"}, is required`,
            });
        }

        const isexistItem = await Restaurant.findOne({ itemname });
        if (isexistItem) {
            return res.status(400).json({
                success: false,
                message: "Restaurant dish is already registered"
            });
        }
        const itemResponse = await uploadOnCloudinary(itemImageLocalPath);
        if (!itemResponse) {
            return res.status(500).json({
                success: false,
                message: "File is not uploaded on Cloudinary",
            })
        }

        const newItem = new Item({ itemname, itemimage: itemResponse.url, itemdescription, itemprice});
        const savedItem = await newItem.save();
        if (!savedItem) {
            return res.status(500).json({
                success: false,
                message: "Restaurant dish Data is not saved to Database",
            })
        }
        const { resId } = req.params;
        let updatecuisines = await Restaurant.findOneAndUpdate({ resid: resId }, { $push: { rescuisine: newItem } }, { new: true });
        if (updatecuisines) {
            return res.status(200).json({
                success: true,
                message: "Restaurant dish added to restaurant Succesfully",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Restaurant dish registered Succesfully",
        });

    } catch (error) {
        console.log("Error in Register the restaurant dish", error.message);
        return res.status(500).json({
            success: false,
            message: "Restaurant dish is not registered Succesfully",
        })
    }
}

const getRestaurant = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        if (restaurants.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No restaurants found",
            });
        }
        return res.status(200).json({
            success: true,
            data: restaurants,
        });
    } catch (error) {
        console.error("Error finding restaurants:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve restaurants from the database",
        });
    }
};
const getRestaurantWithItems = async (req, res) => {
    
    const { resId } = req.params;
    console.log(resId, 'resId')
    try {
        const restaurant = await Restaurant.findOne({ resid: resId });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        return res.status(200).json({
            success: true,
            dish: restaurant
        });
    } catch (error) {
        console.log("Error retrieving restaurant with items", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve restaurant with items"
        });
    }
};


const getRegisteredRestaurant = async (req, res) => {
    try {
        const distributorUser = await Distributor.findOne({ _id: getDistributorId(req) })
        const { restaurant } = distributorUser;
        const registeredRes = restaurant;

        const resDetails = []
        for (let i = 0; i < registeredRes.length; i++) {
            const res = await getRegRes(registeredRes[i]);
            resDetails.push( res );
        }

        if (resDetails.length > 0) {
            return res.json(resDetails)
        } else {
            return 0;
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in finding the restaurant"
        })
    }
}

const getRegRes = async (resId) => {
    const Res = await Restaurant.findOne({ resid: resId });
    return Res;
}

export { registerRestaurant, registerItem, getRestaurant, getRestaurantWithItems, getRegisteredRestaurant };