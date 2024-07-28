let express = require("express");
let router = express.Router();
const user_auth = require("../middleware/user_auth.js");

let {
    cont_register, cont_login, cont_logout, cont_loginp, cont_registerp, cont_forgat_passwordp,
    cont_forgat_password, cont_otpc, cont_changepass, cont_jobseekhome, cont_job_listing, 
    cont_job_detail, cont_applynow, cont_placebid, cont_placedbid, cont_placedbiddetail,cont_seedetail,cont_myprofile,cont_editprofile,cont_savechanged,cont_contact,
    cont_contact_process
} = require("../controller/usercontroller");
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
router.get("/registerp", cont_registerp);
router.post("/register",upload.single("image"), cont_register);
router.get("/loginp", cont_loginp);
router.post("/login", cont_login);
router.get("/logout", user_auth, cont_logout);
router.get("/forgat_passwordp", cont_forgat_passwordp);
router.post("/forgat_password", cont_forgat_password);
router.post("/otpc", cont_otpc);
router.post("/changepass", cont_changepass);
router.get("/jobseekhome", user_auth, cont_jobseekhome);
router.get("/job_listing", user_auth, cont_job_listing);
router.post("/job_detail", user_auth, cont_job_detail);
router.post("/applynow", user_auth, cont_applynow);
router.post("/placebid", user_auth, cont_placebid);
router.get("/placedbid", user_auth, cont_placedbid);
router.post("/placedbiddetail", user_auth, cont_placedbiddetail);
router.post("/seedetail",user_auth,cont_seedetail);
router.get("/myprofile",user_auth,cont_myprofile);
router.get("/editprofile",user_auth,cont_editprofile);
router.post("/savechanged",user_auth, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "cvfile", maxCount: 1 }
]), cont_savechanged);
router.get("/contact",cont_contact);
router.post("/contact_process",cont_contact_process);
module.exports = router;
