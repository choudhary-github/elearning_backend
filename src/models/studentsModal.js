const mongoose = require("mongoose");
const Joi = require("joi");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  isEnrolles: {
    type: Boolean,
    default: false,
  },
});

const Student = mongoose.model("Student", studentSchema);

function validateStudent(student) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phone: Joi.string().min(10).max(12).required(),
    isEnrolles: Joi.boolean(),
  });
  return schema.validate(student);
}

module.exports = { Student, validateStudent };
