const express = require("express");
const router = express.Router();
const Car = require("../models/carModel");
const { validateObjectId } = require('../middleware/security');

/**
 * @route   GET /api/cars/getallcars
 * @desc    Get all cars with optional filtering and pagination
 * @access  Public
 */
router.get("/getallcars", async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      carType, 
      fuelType,
      minPrice,
      maxPrice,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (carType) filter.carType = carType;
    if (fuelType) filter.fuelType = fuelType;
    if (minPrice || maxPrice) {
      filter.rentPerHour = {};
      if (minPrice) filter.rentPerHour.$gte = Number(minPrice);
      if (maxPrice) filter.rentPerHour.$lte = Number(maxPrice);
    }

    // Build sort object
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const cars = await Car.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Car.countDocuments(filter);

    res.json({
      success: true,
      data: cars,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/cars/:id
 * @desc    Get single car by ID
 * @access  Public
 */
router.get("/:id", validateObjectId('id'), async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ 
        success: false,
        error: 'Car not found' 
      });
    }
    
    res.json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/cars/addcar
 * @desc    Add a new car
 * @access  Admin
 */
router.post("/addcar", async (req, res, next) => {
  try {
    const { name, image, rentPerHour, basePricePerHour } = req.body;

    // Validation
    if (!name || !image || !rentPerHour) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, image, and rentPerHour'
      });
    }

    const newcar = new Car({
      ...req.body,
      basePricePerHour: basePricePerHour || rentPerHour
    });
    
    await newcar.save();
    
    res.status(201).json({
      success: true,
      message: 'Car added successfully',
      data: newcar
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/cars/editcar
 * @desc    Edit an existing car
 * @access  Admin
 */
router.post("/editcar", validateObjectId('_id'), async (req, res, next) => {
  try {
    const { _id, name, image, fuelType, rentPerHour, capacity } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        error: 'Car ID is required'
      });
    }

    const car = await Car.findById(_id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    // Update fields if provided
    if (name) car.name = name;
    if (image) car.image = image;
    if (fuelType) car.fuelType = fuelType;
    if (rentPerHour) car.rentPerHour = rentPerHour;
    if (capacity) car.capacity = capacity;

    await car.save();
    
    const allCars = await Car.find();
    
    res.json({
      success: true,
      message: 'Car updated successfully',
      data: allCars
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/cars/deletecar
 * @desc    Delete a car
 * @access  Admin
 */
router.post("/deletecar", async (req, res, next) => {
  try {
    const { carid } = req.body;

    if (!carid) {
      return res.status(400).json({
        success: false,
        error: 'Car ID is required'
      });
    }

    const car = await Car.findById(carid);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    await Car.findByIdAndRemove(carid);

    res.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/cars/:id/review
 * @desc    Add a review to a car
 * @access  Private
 */
router.post("/:id/review", validateObjectId('id'), async (req, res, next) => {
  try {
    const { rating, comment, userId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    const review = {
      user: userId,
      rating: Number(rating),
      comment: comment || '',
      date: new Date()
    };

    car.reviews = car.reviews || [];
    car.reviews.push(review);
    
    // Update average rating
    const totalRating = car.reviews.reduce((sum, r) => sum + r.rating, 0);
    car.averageRating = totalRating / car.reviews.length;
    car.totalReviews = car.reviews.length;

    await car.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: car
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/cars/featured
 * @desc    Get featured/top-rated cars
 * @access  Public
 */
router.get("/featured/list", async (req, res, next) => {
  try {
    const featuredCars = await Car.find({ averageRating: { $gte: 4 } })
      .sort({ averageRating: -1 })
      .limit(6);

    res.json({
      success: true,
      data: featuredCars
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
