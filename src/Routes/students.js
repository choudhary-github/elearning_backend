const express = require("express");
const mongoose = require("mongoose");
const { Student, validateStudent } = require("../models/studentsModal");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let students = await Student.find();
    res.send(students);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newStudent = new Student({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      isEnrolles: req.body.isEnrolles,
    });
    const student = await newStudent.save();
    res.send(student);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send(error.message);
    } else if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyPattern)[0];
      let errorMessage = `The ${duplicateKey} '${error.keyValue[duplicateKey]}' already exists.`;
      return res.status(400).send(errorMessage);
    }
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!student)
      return res.status(404).send("Student with given ID is not found.");

    res.send(student);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      return res.status(400).send("Invalid student ID provided.");
    }
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student || null) {
      return res.status(404).send("The student with given ID is not found.");
    }
    res.send(student);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      return res.status(400).send("Invalid student ID provided.");
    }
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
