const mongoose = require('mongoose');
require('dotenv').config();
const Car = require('./models/carModel');

const carsData = [
  {
    name: "Tesla Model S",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
    capacity: "5 seats",
    fuelType: "Electric",
    rentPerHour: 45,
    bookedTimeSlots: []
  },
  {
    name: "BMW M5",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    capacity: "5 seats",
    fuelType: "Petrol",
    rentPerHour: 55,
    bookedTimeSlots: []
  },
  {
    name: "Mercedes-Benz C-Class",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    capacity: "5 seats",
    fuelType: "Diesel",
    rentPerHour: 50,
    bookedTimeSlots: []
  },
  {
    name: "Audi A6",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    capacity: "5 seats",
    fuelType: "Petrol",
    rentPerHour: 48,
    bookedTimeSlots: []
  },
  {
    name: "Porsche 911",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    capacity: "2 seats",
    fuelType: "Petrol",
    rentPerHour: 75,
    bookedTimeSlots: []
  },
  {
    name: "Range Rover Sport",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
    capacity: "7 seats",
    fuelType: "Diesel",
    rentPerHour: 65,
    bookedTimeSlots: []
  },
  {
    name: "Lamborghini Huracan",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    capacity: "2 seats",
    fuelType: "Petrol",
    rentPerHour: 120,
    bookedTimeSlots: []
  },
  {
    name: "Toyota Camry",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    capacity: "5 seats",
    fuelType: "Hybrid",
    rentPerHour: 35,
    bookedTimeSlots: []
  },
  {
    name: "Ford Mustang",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5f5195f1e?w=800&q=80",
    capacity: "4 seats",
    fuelType: "Petrol",
    rentPerHour: 60,
    bookedTimeSlots: []
  },
  {
    name: "Honda Civic",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
    capacity: "5 seats",
    fuelType: "Petrol",
    rentPerHour: 30,
    bookedTimeSlots: []
  },
  {
    name: "Jeep Wrangler",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    capacity: "5 seats",
    fuelType: "Petrol",
    rentPerHour: 55,
    bookedTimeSlots: []
  },
  {
    name: "Ferrari 488",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    capacity: "2 seats",
    fuelType: "Petrol",
    rentPerHour: 150,
    bookedTimeSlots: []
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Cars', {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    console.log('Connected to MongoDB');

    // Clear existing cars
    await Car.deleteMany({});
    console.log('Cleared existing cars');

    // Insert new cars
    await Car.insertMany(carsData);
    console.log(`Successfully added ${carsData.length} cars to the database!`);

    // Close connection
    mongoose.connection.close();
    console.log('Database seeding completed!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
