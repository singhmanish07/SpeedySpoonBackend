import Distributor from '../models/distributor.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import Restaurant from '../models/restaurant.model.js'
const distributorSignup = async (req, res) => {
  const { name, phoneno, email, password, adharno } = req.body;
  try {
    if (!name || !phoneno || !email || !password || !adharno) {
      return res.status(400).json({
        success: false,
        message: `${!name ? "Name" : !phoneno ? "Contact Number" : !email ? "Email" : !password ? "Password" : "Aadhar Number"} is required`,
      });
    }

    const existingDistributorUser = await Distributor.findOne({ phoneno });
    if (existingDistributorUser) {
      return res.status(400).json({
        success: false,
        message: "This number is already registered",
      });
    }
    let salt = bcrypt.genSaltSync(10);
    let hashPassword = bcrypt.hashSync(password, salt);
    const newDistributorUser = new Distributor({ name, phoneno, email, password: hashPassword, adharno });

    await newDistributorUser.save();

    return res.status(200).json({
      success: true,
      message: "Distributor registered Succesfully",
    })

  } catch (error) {
    console.log("Error in Sign up Distributor", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const distributorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isExistDistributorUser = await Distributor.findOne({ email });
    if (!isExistDistributorUser) {
      return res.status(401).json({
        success: false,
        message: "Email is Not registered",
      });
    }
    const hashPassword = isExistDistributorUser.password;
    const isCorrectPassword = bcrypt.compareSync(password, hashPassword);
    if (!isCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
    const distributorToken = jwt.sign({ id: isExistDistributorUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("distributorToken", distributorToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
    });
    return res.status(200).json({
      success: true,
      message: "Distributor logged in Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const authenticateDistributorJWT = (req, res) => {
  const token = req.cookies.distributorToken;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      message: "Distributor is Logged In",
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Distributor is not Logged In'
    });
  }
}

const DistributorLogout = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.clearCookie('distributorToken', options);
  try {
    delete req.cookies.distributorToken;
    const DistributorCookie = req.cookies.distributorToken;
    if (!DistributorCookie) {
      return res.status(200).json({
        success: true,
        message: "Logout Successfully",
      })
    } else {
      return res.status(500).json({
        success: false,
        message: "Logout unsucess",
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }

}

const getToken = async (req, res) => {
  const userTypeToken = req.cookies
  if (userTypeToken) {
    res.send(userTypeToken)
  }
}

const editRestaurant = async (req, res) => {
  const { newresid, newresname, newreslocation, newrestype, newresopentime, newresclosetime, newresowner, newresdescription } = req.body
  console.log(req.body, "########")
  try {
    
 
  const updateData = await Restaurant.findOneAndUpdate({ resid: newresid }, {
    resname: newresname,
    reslocation: newreslocation,
    restype: newrestype,
    resowner: newresowner,
    resopentime: newresopentime,
    resclosetime: newresclosetime,
    resdescription: newresdescription
  })

  if(updateData){
    return res.status(200).json({
      success: true,
      message: "Restaurant Updated Successfully",
    })
  }else{
    return res.status(500).json({
      success: false,
      message: "Restaurant Details are not updated",
    })
  }
} catch (error) {
    console.log("Error in Edit the Details", error.message)
}

}

export { distributorSignup, distributorLogin, authenticateDistributorJWT, DistributorLogout, getToken, editRestaurant };