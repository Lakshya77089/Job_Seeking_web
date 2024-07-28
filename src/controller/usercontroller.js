let{ser_register,ser_login,ser_logout,ser_forgat_password,ser_otpc,
    ser_changepass,ser_placebid,ser_placedbid,ser_placedbiddetail,ser_seedetail,ser_myprofile,ser_editprofile,ser_savechanged,ser_contact,ser_contact_process}=require("../service/service");
let job=require("../models/job");
exports.cont_register=async(req,rep)=>{
    await ser_register(req,rep);
}

exports.cont_login=async(req,rep)=>{
    await ser_login(req,rep);
}

exports.cont_logout=async(req,rep)=>{
    await ser_logout(req,rep);
}
exports.cont_loginp=async(req,rep)=>{
    rep.render("login");
}
exports.cont_registerp=async(req,rep)=>{
    rep.render("register");
}
exports.cont_forgat_passwordp=async(req,rep)=>{
    rep.render("forgat_password");
}
exports.cont_forgat_password=async(req,rep)=>{
    await ser_forgat_password(req,rep);
}
exports.cont_otpc=async(req,rep)=>{
    await ser_otpc(req,rep);
}
exports.cont_changepass=async(req,rep)=>{
    await ser_changepass(req,rep);
}
exports.cont_jobseekhome=async(req,rep)=>{
    rep.render("jobseekhome",{jobdata:await job.find({},{})});
}
exports.cont_job_listing=async(req,rep)=>{
   let jobData= await job.find({},{});
//    console.log(jobData);
    rep.render("job_listening",{jobData:jobData});
}
exports.cont_job_detail=async(req,rep)=>{
    let id=req.body.id;
    let jobdetail=await job.findOne({_id:id});
    rep.render("job_detail",{job:jobdetail});
}
exports.cont_applynow=async(req,rep)=>{
    let id=req.body.id;
    let jobdetail=await job.findOne({_id:id});
    rep.render("applynow",{id:req.body.id,saltype:jobdetail.fixedSalary,fromsal:jobdetail.salaryFrom,tosal:jobdetail.salaryTo});
}
exports.cont_placebid=async(req,rep)=>{
    await ser_placebid(req,rep);
}
exports.cont_placedbid=async(req,rep)=>{
    await ser_placedbid(req,rep);
}
exports.cont_placedbiddetail=async(req,rep)=>{
    await ser_placedbiddetail(req,rep);
}
exports.cont_seedetail=async(req,rep)=>{
    await ser_seedetail(req,rep);
}
exports.cont_myprofile=async(req,rep)=>{
    await ser_myprofile(req,rep);
}
exports.cont_editprofile=async(req,rep)=>{
    await ser_editprofile(req,rep);
}
exports.cont_savechanged=async(req,rep)=>{
    await ser_savechanged(req,rep);
}
exports.cont_contact=async(req,rep)=>{
    await ser_contact(req,rep);
}
exports.cont_contact_process=async(req,rep)=>{
    await ser_contact_process(req,rep);
}