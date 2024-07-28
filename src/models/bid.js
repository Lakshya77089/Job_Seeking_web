let mong=require("mongoose");
let sch=mong.Schema({
    applyby:{
        type:String,
    },
    createdby:{
        type:String,
    },
    amount:{
        type:Number,
    },
    description:{
        type:String,
    },
    deadline:{
        type:Number,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    jobid: {
        type: mong.Schema.ObjectId,
      },
});


module.exports=mong.model("bid",sch);