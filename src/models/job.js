let mongoose=require("mongoose");
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
  },
  description: {
    type: String,
    required: [true, "Please provide decription."],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."],
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."],
  },
  location: {
    type: String,
    required: [true, "Please provide location."],
  },
  fixedSalary: {
    type: Number,
    minLength: [1, "Salary must contain at least 4 digits"],
  },
  salaryFrom: {
    type: Number,
    minLength: [1, "Salary must contain at least 4 digits"],
  },
  salaryTo: {
    type: Number,
    minLength: [1, "Salary must contain at least 4 digits"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  SkillRequired:{
    type:String,
    required:true,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  Vacancy:{
    type:Number,
    required:true,
  },
  cominfo:{
    type:String,
  },
  comname:{
    type:String,
  },
  comlink:{
    type:String,
  },
  comemail:{
    type:String,
    required:true,
  },
  path:{
    type:String,
  },
  applicationdate:{
    type:String,
  }
});

module.exports = mongoose.model("Job", jobSchema);