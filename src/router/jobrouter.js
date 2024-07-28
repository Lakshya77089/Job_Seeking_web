let express=require("express");
let router=express.Router();

let path=require("path");
let user_auth=require("../middleware/user_auth");
let multer=require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    return  cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
    return  cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  const upload=multer({storage});  
let{cont_getalljobs,cont_postjob,cont_postjobp,cont_viewapp,cont_view_detail,cont_applyapp,
  cont_applyapp2,cont_employerhome,cont_editjob,cont_savejob,cont_deletejob,cont_closebid,cont_recruiter,cont_submit_selected,cont_emplmyprofile,cont_empleditprofile,cont_emplsavechanged}=require("../controller/jobcontroller");
router.get("/getalljobs",user_auth,cont_getalljobs);
router.get("/postjobp",user_auth,cont_postjobp);
router.post("/postjob",upload.single("image"),user_auth,cont_postjob);
router.get("/viewapp",user_auth,cont_viewapp);
router.post("/view_detail",user_auth,cont_view_detail);
router.get("/applyapp",user_auth,cont_applyapp);
router.post("/applyapp2",user_auth,cont_applyapp2);
router.get("/employerhome",user_auth,cont_employerhome);
router.post("/editjob",cont_editjob);
router.post("/savejob",upload.single("image"),user_auth,cont_savejob);
router.post("/deletejob",user_auth,cont_deletejob);
router.post("/closebid",user_auth,cont_closebid);
router.post("/recruiter",user_auth,cont_recruiter);
router.post("/submit_selected",user_auth,cont_submit_selected);
router.get("/emplmyprofile",user_auth,cont_emplmyprofile);
router.get("/empleditprofile",user_auth,cont_empleditprofile);
router.post("/emplsavechanged",upload.single("image"),user_auth,cont_emplsavechanged);
module.exports=router;