const { default: ErrorHandler } = require("../middleware/error");
let user=require("../models/user");
let Job=require("../models/job");
let bcrypt=require("bcrypt");
let jwt=require("jsonwebtoken");
let nodemailer=require("nodemailer");
let bid=require("../models/bid");
let emailp;
let comment=require("../models/comment");
const mongoose = require('mongoose');
let cloudinary=require("cloudinary");
let moment=require("moment");
exports.ser_register=async(req,rep)=>{
    try{
        const{name,email,phone,role,password}=req.body;
        //  console.log(name,email,phone,role,password);
        const file=req.file.path;  
        // console.log()
        const updatedFilePath = file.replace('public', '');
        if(!name||!email||!phone||!role||!password){
            return rep.render("register",{message:"Fill all the information"});
        }
        const isEmail=await user.findOne({email:email});
        if(isEmail){
            return rep.render("login",{message:"User already exist"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt);
        emailp=email;
        let use=new user({
            name:name,
            email:email, 
            phone:phone,
            role:role,
            password:hashedpassword,
            path:updatedFilePath,
        });
       await use.save();
       if(role=="Job Seeker") rep.render("jobseekhome",{jobdata:await Job.find({},{})});
       else rep.render("employerhome");
    }catch(error){
        // console.log(error);
        return rep.status(500).send({ message: 'Internal Server Error' });
    }
}
exports.ser_login=async(req,rep)=>{
    // role=req.body.role;
    const {email,password,role}=req.body;
    // console.log(email,password,role);
    emailp=email;
    if(!email||!password||!role)  {rep.render("login",{message:"Fill all the information."});
        return ;
    }
    const isEmail=await user.findOne({email:email});
    // console.log(isEmail);
    // postedBy=isEmail._id;
    if(!isEmail)  {rep.render("login",{message:"Email doesn't exist."});
return ;}
    // const existingUser=await user.findOne({email:isEmail});
    const isPasswordValid=await bcrypt.compare(password,isEmail.password);
    if(!isPasswordValid) {rep.render("login",{message:"Wrong Password"});
return;}
    if (isEmail.role != role) {
        rep.render("login",{message:"Email and role do not match."})
        return;
      }
      const token=jwt.sign({id:isEmail._id},"process.env.SECRET_KEY");
        rep.cookie("token",token,{
            httpOnly:true,
            secure:true,
        });
        if(!token) rep.render("login",{message:"Technical Error"})
        const authKeyInsertion=await user.findOneAndUpdate(
            {_id:isEmail._id},
            {auth_key:token},
            {new:true}
        );
        if(!authKeyInsertion) rep.render("login",{message:"Technical Error"})
        if(role=="Job Seeker") rep.render("jobseekhome",{jobdata:await Job.find({},{})});
        else rep.render("employerhome");
}
exports.ser_logout = async (req, res) => {
  try {
      res.clearCookie("token", { path: '/' });
      let user_data = await user.findOneAndUpdate(
          { user_id: req.user.user_id },
          { auth_key: null }
      );
      if (user_data) {
          res.redirect("/loginp");
      } else {
          res.render("jobseekhome", { message: "Try Again",jobdata:await Job.find({},{})} );
      }
  } catch (err) {
      console.error("Logout Error: ", err);
      res.status(500).render("jobseekhome", { message: "Internal Server Error",jobdata:await Job.find({},{}) });
  }
}



exports.ser_getalljobs=async(req,rep)=>{
    const jobs=await Job.find({expired:false});
    rep.status(200).json({success:true,jobs,});
}
exports.ser_postjob=async(req,rep)=>{
    const {
        title,
        description,
        category,
        country,
        fixsal,
        fromsal,
        tosal,
        location,
        city,
        skill,
        vacancy,
        cominfo,
        comname,
        comlink,
        comemail,
        datetime,
      } = req.body;
      const file=req.file.path;  
       const updatedFilePath = file.replace('public', '');
if (fixsal!="") {
  const {fixsal}=req.body;
  let postedby=await user.findOne({email:emailp});
      const job = await Job.create({
        title:title,
        description:description,
        category:category,
        country:country,
        city:city,
        location:location,
        fixedSalary:fixsal,
        postedBy:postedby._id,
        SkillRequired:skill,
        Vacancy:vacancy,
        cominfo:cominfo,
        comname:comname,
        comlink:comlink,
        comemail:comemail,
        path:updatedFilePath,
        applicationdate:moment(datetime).format('MMMM D, YYYY h:mm A'),
      });
      await job.save();
} else {
  const{fromsal,tosal}=req.body;
  let postedby=await user.findOne({email:emailp});
      const job = await Job.create({
        title:title,
        description:description,
        category:category,
        country:country,
        city:city,
        location:location,
        salaryFrom:fromsal,
        salaryTo:tosal,
        postedBy:postedby._id,
        SkillRequired:skill,
        Vacancy:vacancy,
        cominfo:cominfo,
        comname:comname,
        comlink:comlink,
        comemail:comemail,
        path:updatedFilePath,
        applicationdate:moment(datetime).format('MMMM D, YYYY h:mm A'),
      });
      await job.save();
}
      rep.render("employerhome",{message:"Job Posted Successfully"});
}
exports.ser_forgat_password=async(req,rep)=>{
    const{email,role}=req.body;
    const isEmail=await user.findOne({email:email});
    if(!isEmail)  {rep.render("forgat_password",{message:"Email doesn't exist."});
return ;}
    if (isEmail.role != role) {
        rep.render("forgat_password",{message:"Email and role do not match."});
        return;
      }
      emailp=email;
    function generateOTP() {
        const digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 6; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      }

      const otp = generateOTP();
      let userData = await user.findOneAndUpdate(
        { otp: otp }
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "tanishasharma4383@gmail.com",
          pass: "process.env.AUTH",
        },
      });

      const mailOptions = {
        from: "tanishasharma4383@gmail.com",
        to: email,
        subject: "Your OTP for Gmail Verification",
        text: `Your OTP is: ${otp}`,
      };
      const data1 = await transporter.sendMail(mailOptions);
      rep.render("otp_validationp",{otp:otp,email:email})
}
exports.ser_otpc=async(req,rep)=>{
     let rotp=req.body.otp;
    const otp=[];
     otp[0]=req.body.otpInput1;
     otp[1]=req.body.otpInput2;
     otp[2]=req.body.otpInput3;
     otp[3]=req.body.otpInput4;
     otp[4]=req.body.otpInput5;
     otp[5]=req.body.otpInput6;
     const result=otp.join('');
    //  console.log(result);
     if(rotp==result) rep.render("change_password");
     else rep.render("forgat_password",{message:"Wrong OTP"});
}
exports.ser_changepass=async(req,rep)=>{
    let npass=req.body.npassword;
    let cpass=req.body.cpassword;
    if(npass!=cpass) rep.render("change_password",{message:"Password & Confirm Password do not match"});
    let isEmail=await user.findOne({email:emailp});
    // console.log(isEmail);
    const isPasswordValid=await bcrypt.compare(npass,isEmail.password);
    if(isPasswordValid) rep.render("change_password",{message:"New password is same as old password"});
    const salt=await bcrypt.genSalt(10);
    const hashedpassword=await bcrypt.hash(npass,salt);
    await user.updateOne({email:emailp},{$set:{password:hashedpassword}});
    rep.render("login");
}
exports.ser_viewapp=async(req,rep)=>{
  let isEmail=await user.findOne({email:emailp});
  let id=isEmail._id;
  let applyapp=await Job.find({postedBy:id});
  rep.render("viewapplication",{application:applyapp});
}
exports.ser_view_detail=async(req,rep)=>{
  let id=req.body.id;
  let jobdetail=await Job.findOne({_id:id});
  rep.render("viewjob_detail",{job:jobdetail});
}
exports.ser_applyapp=async(req,rep)=>{
  let isEmail=await user.findOne({email:emailp});
  let id=isEmail._id;
  let applyapp=await Job.find({postedBy:id});
  rep.render("applyapp",{application:applyapp});
}
exports.ser_applyapp2=async(req,rep)=>{
  let id=req.body.id;
  let applyapp=await bid.find({jobid:id}).lean();
  for (let obj of applyapp) {
    
      obj["path"] = (await user.findOne({ email: obj.applyby })).path;
    
  }
  // console.log(applyapp);
  
  let jobdetail=await Job.findOne({_id:id});
  //  console.log()
   rep.render("applyapp2",{application:applyapp,job:jobdetail});
}
exports.ser_placebid=async(req,rep)=>{
  let id=req.body.id;
  let bidamount=req.body.bidamount;
  let jobdetail=await Job.findOne({_id:id});
  // console.log(jobdetail);
  let fromsal=jobdetail.salaryFrom;
  let tosal=jobdetail.salaryTo;
  let days=req.body.days;
  let description=req.body.description;
  if(!bidamount||!description||!days){rep.render("applynow",{message:"Fill all the information",id:id,saltype:jobdetail.fixedSalary,fromsal:jobdetail.salaryFrom,tosal:jobdetail.salaryTo});}
  if(bidamount<fromsal || bidamount>tosal){ rep.render("applynow",{message:"Bid amount should be in range",id:id,saltype:jobdetail.fixedSalary,fromsal:jobdetail.salaryFrom,tosal:jobdetail.salaryTo});}
  let use=await bid.create({
    deadline:days,
    description:description,
    amount:bidamount,
    applyby:emailp,
    createdby:jobdetail.postedBy,
    jobid:id,
  })
  await use.save();
  let jobData= await Job.find({},{});
  rep.render("job_listening",{message:"Your bid is placed",jobData:jobData});
}
exports.ser_placedbid=async(req,rep)=>{
  let fulldata=[];
  let jobdata=await bid.find({applyby:emailp});
  // console.log(jobdata);
  for(let data of jobdata){
    fulldata.push(await Job.findOne({_id:data.jobid}))
  }
  // console.log(fulldata);
  rep.render("placedbid",{jobdata:fulldata});
}
exports.ser_placedbiddetail=async(req,rep)=>{
  let jobid=req.body.jobid;
  let biddetail=await bid.findOne({jobid:jobid,applyby:emailp});
  let jobdata=await Job.findOne({_id:jobid});
  rep.render("placedbiddetail",{job:jobdata,biddetail:biddetail});
}
exports.ser_seedetail=async(req,rep)=>{
let userid=req.body.userid;
// console.log(userid);
let biddetail=await bid.findOne({_id:userid});
// console.log(biddetail);
let jobid=biddetail.jobid;
let jobdetail=await Job.findOne({_id:jobid});
let persondetail=await user.findOne({email:biddetail.applyby});
// console.log(persondetail);
rep.render("seedetail",{job:jobdetail,biddetail:biddetail,person:persondetail});
}
exports.ser_myprofile=async(req,rep)=>{
  let fulldetail=await user.findOne({email:emailp});
  rep.render("myprofile",{fulldetail:fulldetail});
}
exports.ser_editprofile=async(req,rep)=>{
  let fulldetail=await user.findOne({email:emailp});
  rep.render("editprofile",{fulldetail:fulldetail});
}
exports.ser_savechanged=async(req,rep)=>{
  let name=req.body.name;
  let email=req.body.email;
  let phone=req.body.phone;
  let address=req.body.address;
  let github=req.body.github;
  let twitter=req.body.twitter;
  let instagram=req.body.instagram;
  let facebook=req.body.facebook;
  if (req.files && req.files.image) {
    const imagePath = req.files.image[0].path.replace('public', '');
    await user.updateOne({ email: emailp }, { $set: { path: imagePath } });
  }
  if (req.files && req.files.cvfile) {
    const cvFilePath = req.files.cvfile[0].path.replace('public', '');
    await user.updateOne({ email: emailp }, { $set: { cvpath: cvFilePath } });
  }
  await user.updateOne({email:emailp},{$set:{name:name,email:email,phone:phone,address:address,github:github,twitter:twitter,instagram:instagram,facebook:facebook}});
  emailp=(await user.findOne({email:emailp})).email;
  let fulldetail=await user.findOne({email:emailp});
  rep.render("jobseekhome",{jobdata:await Job.find({},{}),message:"Updated successfully"});
}
exports.ser_editjob=async(req,rep)=>{
  let id =req.body.id;
  let jobdetail=await Job.findOne({_id:id});
  // console.log(jobdetail);
  rep.render("editjob",{jobdetail:jobdetail});
}
exports.ser_savejob=async(req,rep)=>{
  let title=req.body.title;
  let description=req.body.description;
  let category=req.body.category;
  let country=req.body.country;
  let city=req.body.city;
  let location=req.body.location;
  let skillrequired=req.body.skillrequired;
  let vacancy=req.body.vacancy;
  let salaryFrom=req.body.salaryFrom;
  let salaryTo=req.body.salaryTo;
  let cominfo=req.body.cominfo;
  let comname=req.body.comname;
  let comlink=req.body.comlink;
  let comemail=req.body.comemail;
  let existingUser=await user.findOne({email:emailp});
  let postedid=existingUser._id;
  let jobdetail=await Job.findOne({postedBy:postedid});
  // console.log(jobdetail);
  if (req.file) {
    const filePath = req.file.path;
    const updatedFilePath = filePath.replace('public', '');
    await Job.updateOne({ _id: jobdetail._id }, { $set: { path: updatedFilePath } });
  }
  await Job.updateOne({_id:jobdetail._id},{$set:{title:title,description:description,category:category,country:country,city:city,location:location,salaryFrom:salaryFrom,salaryTo:salaryTo,SkillRequired:skillrequired,Vacancy:vacancy,cominfo:cominfo,comname:comname,comlink:comlink,comemail:comemail}});
  rep.render("employerhome",{jobdata:await Job.find({},{})});
}
exports.ser_deletejob=async(req,rep)=>{
  let id=req.body.id;
  await Job.deleteOne({_id:id});
  rep.render("employerhome",{jobdata:await Job.find({},{})});
}
exports.ser_closebid=async(req,rep)=>{
  let id=req.body.id;
  let jobdetail=await Job.findOne({_id:id});
  // let createddate=jobdetail.jobPostedOn;
  // let lastdate=jobdetail.applicationdate;
  // const applicationDate = new Date(jobdetail.applicationDate);
  // const now = new Date();
  // jobdetail.jobPostedOn=new Date(now.getTime() + 1000);
  // await jobdetail.save();
  let now=new Date();
  jobdetail.applicationdate=now;
  jobdetail.jobPostedOn=new Date(now.getTime()+1000);
  
    await jobdetail.save();
    emailp=(await user.findOne({email:emailp})).email;
    let isEmail=await user.findOne({email:emailp});
   id=isEmail._id;
  let applyapp=await Job.find({postedBy:id});
    rep.render("employerhome",{application:applyapp,message:"Your bid is closed"});
}
exports.ser_recruiter=async(req,rep)=>{
  let id=req.body.id;
  let applyapp=await bid.find({jobid:id}).lean();
  for (let obj of applyapp) {
    
      obj["path"] = (await user.findOne({ email: obj.applyby })).path;
    
  }
  // console.log(applyapp);
  
  let jobdetail=await Job.findOne({_id:id});
  //  console.log()
   rep.render("recruiter",{application:applyapp,job:jobdetail});
}
exports.ser_submit_selected=async(req,rep)=>{
  let job=req.body.job;
  if(!req.body.selectedUserids){rep.render("employerhome",{message:"Select something"});
return; }
  let data=req.body.selectedUserids;
  if(job.Vacancy<data.length){ rep.render("employer",{message:"peoples should not be greater then vacany"});
return;}
  let recdetail=await user.findOne({email:emailp});
  console.log(data);
  if(Array.isArray(data)){for(let obj of data){
    // console.log(obj);
    let bidinfo = await bid.findOne({ _id:obj.toString()});
    let persondetail=await user.findOne({email:bidinfo.applyby});
    
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "tanishasharma4383@gmail.com",
          pass: "process.env.AUTH",
        },
      });

      const mailOptions = {
        from: "tanishasharma4383@gmail.com",
        to: bidinfo.applyby,
        subject: `Congratulations! You've Been Selected for the Job Opportunity`,
        text: `Dear ${persondetail.name},
        We are thrilled to inform you that you have been selected for the ${job.title} position at ${job.comname}. We were impressed by your skills and experience, and we believe you would be a great fit for our team.

Please find below the contact details of our recruiter, who will be in touch with you to discuss the next steps:

Recruiter's Name: ${recdetail.name} Email: ${recdetail.email} Phone: ${recdetail.phone}

We look forward to hearing from you soon. Congratulations again on your selection!

Best regards, ${job.title} Team`,
      };
      const data1 = await transporter.sendMail(mailOptions);
  }
  rep.render("employerhome",{message:"message is send to selected person with your info"});
return;}

    console.log("here");
    let bidinfo = await bid.findOne({ _id:data.toString()});
    let persondetail=await user.findOne({email:bidinfo.applyby});
    const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "tanishasharma4383@gmail.com",
                pass: "process.env.AUTH",
              },
            });
      
            const mailOptions = {
              from: "tanishasharma4383@gmail.com",
              to: bidinfo.applyby,
              subject: `Congratulations! You've Been Selected for the Job Opportunity`,
              text: `Dear ${persondetail.name},
              We are thrilled to inform you that you have been selected for the ${job.title} position at ${job.comname}. We were impressed by your skills and experience, and we believe you would be a great fit for our team.
      
      Please find below the contact details of our recruiter, who will be in touch with you to discuss the next steps:
      
      Recruiter's Name: ${recdetail.name} Email: ${recdetail.email} Phone: ${recdetail.phone}
      
      We look forward to hearing from you soon. Congratulations again on your selection!
      
      Best regards, ${job.title} Team`,
            };
            const data1 = await transporter.sendMail(mailOptions);
            rep.render("employerhome",{message:"message is send to selected person with your info"});
  
}
exports.ser_contact=async(req,rep)=>{
  rep.render("contact");
}
exports.ser_contact_process=async(req,rep)=>{
  let message=req.body.message;
  let name=req.body.name;
  let subject=req.body.subject;
  let use=new comment({
    name:name,
    message:message,
    subject:subject
  });
  await use.save();
  rep.render("jobseekhome",{message:"Thanks for the feedback"});
}
exports.ser_emplmyprofile=async(req,rep)=>{
  let fulldetail=await user.findOne({email:emailp});
  rep.render("emplmyprofile",{fulldetail:fulldetail});
}
exports.ser_empleditprofile=async(req,rep)=>{
  let fulldetail=await user.findOne({email:emailp});
  rep.render("empleditprofile",{fulldetail:fulldetail});
}
exports.ser_emplsavechanged=async(req,rep)=>{
  let name=req.body.name;
  let email=req.body.email;
  let phone=req.body.phone;
  let address=req.body.address;
  let github=req.body.github;
  let twitter=req.body.twitter;
  let instagram=req.body.instagram;
  let facebook=req.body.facebook;
  if (req.file) {
    const filePath = req.file.path;
    const updatedFilePath = filePath.replace('public', '');
    await user.updateOne({ email: emailp }, { $set: { path: updatedFilePath } });
  }
  await user.updateOne({email:emailp},{$set:{name:name,email:email,phone:phone,address:address,github:github,twitter:twitter,instagram:instagram,facebook:facebook}});
  emailp=(await user.findOne({email:emailp})).email;
  let fulldetail=await user.findOne({email:emailp});
  rep.render("employerhome",{message:"Updated successfully"});
}