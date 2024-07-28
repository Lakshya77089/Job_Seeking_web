let{ser_getalljobs,ser_postjob,ser_viewapp,ser_view_detail,ser_applyapp,ser_applyapp2,ser_editjob,ser_savejob,
    ser_deletejob,ser_closebid,ser_recruiter,ser_submit_selected,ser_emplmyprofile,ser_empleditprofile,ser_emplsavechanged}=require("../service/service");
exports.cont_getalljobs=async(req,rep)=>{
    await ser_getalljobs(req,rep);
}
exports.cont_postjob=async(req,rep)=>{
    await ser_postjob(req,rep);
}
exports.cont_postjobp=async(req,rep)=>{
    rep.render("postjob");
}
exports.cont_viewapp=async(req,rep)=>{
    await ser_viewapp(req,rep);
}
exports.cont_view_detail=async(req,rep)=>{
    await ser_view_detail(req,rep);
}
exports.cont_applyapp=async(req,rep)=>{
    await ser_applyapp(req,rep);
}
exports.cont_applyapp2=async(req,rep)=>{
    await ser_applyapp2(req,rep);
}
exports.cont_employerhome=async(req,rep)=>{
    rep.render("employerhome");
}
exports.cont_editjob=async(req,rep)=>{
    await ser_editjob(req,rep);
}
exports.cont_savejob=async(req,rep)=>{
    await ser_savejob(req,rep);
}
exports.cont_deletejob=async(req,rep)=>{
    await ser_deletejob(req,rep);
}
exports.cont_closebid=async(req,rep)=>{
    await ser_closebid(req,rep);
}
exports.cont_recruiter=async(req,rep)=>{
    await ser_recruiter(req,rep);
}
exports.cont_submit_selected=async(req,rep)=>{
    await ser_submit_selected(req,rep);
}
exports.cont_emplmyprofile=async(req,rep)=>{
    await ser_emplmyprofile(req,rep);
}
exports.cont_empleditprofile=async(req,rep)=>{
    await ser_empleditprofile(req,rep);
}
exports.cont_emplsavechanged=async(req,rep)=>{
    await ser_emplsavechanged(req,rep);
}