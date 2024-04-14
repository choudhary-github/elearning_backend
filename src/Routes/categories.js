const express = require("express");
const mongoose = require("mongoose");
const { Category, validateCategory } = require("../models/categoriesModal");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let categories = await Category.find();
    res.send(categories);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newCategory = new Category({
      name: req.body.name,
    });
    const category = await newCategory.save();
    res.send(category);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!category)
      return res.status(404).send("Category with given ID is not found.");

    res.send(category);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      return res.status(400).send("Invalid category ID provided.");
    }
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).send("The category with given ID is not found.");

    res.send(category);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      return res.status(400).send("Invalid category ID provided.");
    }
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || null) {
      return res.status(404).send("The category with given ID is not found.");
    }
    res.send(category);
  } catch (error) {
    // console.error("Error while fetching category:", error.stack);
    if (error instanceof mongoose.CastError) {
      return res.status(400).send("Invalid category ID provided.");
    }
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/", async (req, res) => {
  try {
    const categories = await Category.deleteMany();
    res.send(categories);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
