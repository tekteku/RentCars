const express = require("express");
const router = express.Router();
const CarHealth = require("../models/carHealthModel");
const Car = require("../models/carModel");

// Get car health status
router.get("/:carId", async (req, res) => {
  try {
    let carHealth = await CarHealth.findOne({ car: req.params.carId }).populate('car');
    
    if (!carHealth) {
      carHealth = new CarHealth({
        car: req.params.carId,
        healthScore: 100,
        fuelLevel: 100
      });
      await carHealth.save();
    }
    
    res.send(carHealth);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Update car location (IoT simulation)
router.post("/update-location", async (req, res) => {
  try {
    const { carId, latitude, longitude, address } = req.body;
    
    const carHealth = await CarHealth.findOne({ car: carId });
    
    carHealth.currentLocation = {
      latitude,
      longitude,
      address,
      lastUpdated: new Date()
    };
    
    await carHealth.save();
    
    res.send({
      success: true,
      location: carHealth.currentLocation
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Update fuel/battery level
router.post("/update-fuel", async (req, res) => {
  try {
    const { carId, fuelLevel, batteryLevel } = req.body;
    
    const carHealth = await CarHealth.findOne({ car: carId });
    
    if (fuelLevel !== undefined) {
      carHealth.fuelLevel = fuelLevel;
      
      // Create alert if fuel is low
      if (fuelLevel < 20) {
        carHealth.alerts.push({
          type: 'Low Fuel',
          message: `Fuel level is at ${fuelLevel}%. Please refuel soon.`,
          priority: fuelLevel < 10 ? 'High' : 'Medium'
        });
      }
    }
    
    if (batteryLevel !== undefined) {
      carHealth.batteryLevel = batteryLevel;
      
      // Create alert if battery is low
      if (batteryLevel < 20) {
        carHealth.alerts.push({
          type: 'Low Battery',
          message: `Battery level is at ${batteryLevel}%. Please charge soon.`,
          priority: batteryLevel < 10 ? 'High' : 'Medium'
        });
      }
    }
    
    await carHealth.save();
    
    res.send({
      success: true,
      carHealth
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Report an issue
router.post("/report-issue", async (req, res) => {
  try {
    const { carId, issueType, severity, description } = req.body;
    
    const carHealth = await CarHealth.findOne({ car: carId });
    
    carHealth.issues.push({
      type: issueType,
      severity: severity,
      description: description,
      reportedDate: new Date(),
      resolved: false
    });
    
    // Update health score based on severity
    if (severity === 'Critical') {
      carHealth.healthScore = Math.max(0, carHealth.healthScore - 30);
    } else if (severity === 'High') {
      carHealth.healthScore = Math.max(0, carHealth.healthScore - 20);
    } else if (severity === 'Medium') {
      carHealth.healthScore = Math.max(0, carHealth.healthScore - 10);
    }
    
    // Create alert
    carHealth.alerts.push({
      type: issueType,
      message: description,
      priority: severity === 'Critical' || severity === 'High' ? 'High' : 'Medium'
    });
    
    await carHealth.save();
    
    // Update car availability if critical
    if (severity === 'Critical') {
      await Car.findByIdAndUpdate(carId, { 
        isAvailable: false,
        maintenanceStatus: 'In Service'
      });
    }
    
    res.send({
      success: true,
      carHealth,
      message: "Issue reported successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Add inspection report
router.post("/add-inspection", async (req, res) => {
  try {
    const { carId, userId, photos, damageReports, overallCondition } = req.body;
    
    const carHealth = await CarHealth.findOne({ car: carId });
    
    carHealth.inspections.push({
      inspectedBy: userId,
      date: new Date(),
      photos: photos || [],
      damageReports: damageReports || [],
      overallCondition: overallCondition
    });
    
    await carHealth.save();
    
    res.send({
      success: true,
      carHealth,
      message: "Inspection added successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Add maintenance record
router.post("/add-maintenance", async (req, res) => {
  try {
    const { carId, date, type, cost, description, performedBy } = req.body;
    
    const carHealth = await CarHealth.findOne({ car: carId });
    
    carHealth.maintenanceHistory.push({
      date: date || new Date(),
      type,
      cost,
      description,
      performedBy
    });
    
    carHealth.lastServiceDate = date || new Date();
    
    // Calculate next service due (90 days from last service)
    const nextService = new Date(carHealth.lastServiceDate);
    nextService.setDate(nextService.getDate() + 90);
    carHealth.nextServiceDue = nextService;
    
    // Improve health score after maintenance
    carHealth.healthScore = Math.min(100, carHealth.healthScore + 20);
    
    // Mark resolved issues
    carHealth.issues.forEach(issue => {
      if (!issue.resolved && issue.type === type) {
        issue.resolved = true;
      }
    });
    
    await carHealth.save();
    
    // Update car status
    await Car.findByIdAndUpdate(carId, { 
      isAvailable: true,
      maintenanceStatus: 'Good'
    });
    
    res.send({
      success: true,
      carHealth,
      message: "Maintenance record added successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Get all alerts for a car
router.get("/alerts/:carId", async (req, res) => {
  try {
    const carHealth = await CarHealth.findOne({ car: req.params.carId });
    
    const unacknowledgedAlerts = carHealth.alerts.filter(a => !a.acknowledged);
    
    res.send(unacknowledgedAlerts);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Acknowledge alert
router.post("/acknowledge-alert", async (req, res) => {
  try {
    const { carId, alertId } = req.body;
    
    const carHealth = await CarHealth.findOne({ car: carId });
    
    const alert = carHealth.alerts.id(alertId);
    if (alert) {
      alert.acknowledged = true;
    }
    
    await carHealth.save();
    
    res.send({
      success: true,
      message: "Alert acknowledged"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Update tire pressure
router.post("/update-tire-pressure", async (req, res) => {
  try {
    const { carId, frontLeft, frontRight, rearLeft, rearRight } = req.body;
    
    const carHealth = await CarHealth.findOne({ car: carId });
    
    carHealth.tirePressure = {
      frontLeft,
      frontRight,
      rearLeft,
      rearRight,
      unit: 'PSI'
    };
    
    // Check for low tire pressure
    const recommendedPressure = 32; // PSI
    const lowPressureThreshold = 28;
    
    const pressures = [frontLeft, frontRight, rearLeft, rearRight];
    const hasLowPressure = pressures.some(p => p < lowPressureThreshold);
    
    if (hasLowPressure) {
      carHealth.alerts.push({
        type: 'Tire Pressure',
        message: 'One or more tires have low pressure. Please check and inflate.',
        priority: 'Medium'
      });
    }
    
    await carHealth.save();
    
    res.send({
      success: true,
      carHealth
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
