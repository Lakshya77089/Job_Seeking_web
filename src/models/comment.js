let mong=require("mongoose");
let sch=mong.Schema({
    message:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true,
    },
});


module.exports=mong.model("comment",sch);