let mong=require("mongoose");
let validate=require("validator");
let bcrypt=require("bcrypt");
let sch=mong.Schema({
    name:{type:String,
        required:[true,"Please provide your name"],
        minLength:[3,"name should be minimium length of 3"],
        maxLength:[32,"name should be maximium length of 32"],
    },
    email:{type:String,
        required:[true,"Please provide valide email"],
        validate:validate.isEmail,
    },
    phone:{
        type:Number,
        required:[true,"PLease provide your phone number"]
    },
    password:{
        type:String,
        required:[true,"Please provide your password"],
    },
    role:{
        type:String,
        required:[true,"Please provide valide role"],
        enum:["Job Seeker","Employer"],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    auth_key:{
        type:String,
        default:"",
    },
    path:{
        type:String,
        default:"/uploads/common.png",
      },
    address:{
        type:String,
        default:"",
    },
    github:{
        type:String,
        default:"",
    },
    instagram:{
        type:String,
        default:"",
    },
    facebook:{
        type:String,
        default:"",
    },
    twitter:{
        type:String,
        default:"",
    },
    cvpath:{
        type:String,
        default:"/uploads/common.png",
    },
});


module.exports=mong.model(process.env.USER_NAME,sch);