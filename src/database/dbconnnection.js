let mong=require("mongoose");
exports.conDB=()=>
    {
        let con=mong.connect(process.env.DB_URL);
        console.log("data base connect");
    }