import mongoose from "mongoose";
const ItemSchema=new mongoose.Schema({
    itemname:{
        type:String,
        required: true,
        unique:true,
    },

    itemimage:{
        type:String,
        required:true,
    },
    
    itemdescription:{
        type:String,
    },

    itemprice:{
        type:Number,
        required:true,
    },

    iteminstock:{
        type:String,
    }

});

const restaurantSchema=new mongoose.Schema({
    resid:{
        type:String,
        required:true,
        unique:true,
    },
    resname:{
        type:String,
        required: true,
    },
    reslocation:{
        type:String,
        required: true,
    },
    restype:{
        type:String,
        required:true,
    },

    // TODO: modified rescuisine field
    rescuisine:{
        type: Array
    },
    resrating:{
        type:mongoose.Decimal128,
    },
    resdescription:{
        type:String,
    },
    resimage:{
        type:String,
        required:true,
    },
    resowner:{
        type:String,
        required:true,
    },
    resopentime:{
        type:String,
        required:true,
    },
    resclosetime:{
        type:String,
        required:true,
    }
});

const Restaurant= mongoose.model('Restaurant', restaurantSchema);
export const Item= mongoose.model('Item', ItemSchema);
export default Restaurant;