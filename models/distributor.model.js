import mongoose from "mongoose";

const distributorSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phoneno:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    adharno:{
        type:String,
        required:true,
        unique:true,
    },
    restaurant:{
        type:Array,
    }
});

const Distributor= mongoose.model('Distributor', distributorSchema);

export default Distributor;