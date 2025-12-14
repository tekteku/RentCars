const mongoose = require('mongoose');
require('dotenv').config();
//const newLocal = mongoose.connection;
function connectDB() {
   mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Cars', {
   useUnifiedTopology: true,
   useNewUrlParser: true
   
   })

   const connection = mongoose.connection;
   connection.on('connected', async () => {

      console.log('Mongo DB  Connection successfull')

      /* const carsData = [
         {
           _id: "61d1f4cdc144068a5ae8ba8e",
           image: "/images/CitroenC3.jpg",
           name: "Citroen C3",
           rentPerHour: "50eur/ ",
           bookedTimeSlots: []
         },
         {
           _id: "61d1f4cdc144068a5ae8ba8f",
           image: "/images/ford-fiesta-6.jpg",
           name: "Ford Fiesta 6",
           rentPerHour: "65eur/ ",
           bookedTimeSlots: []
         },
         {
           _id: "61d1f4cdc144068a5ae8ba90",
           image: "/images/Golf7.jpg",
           name: "Golf 7",
           rentPerHour: "65eur/ ",
           bookedTimeSlots: []
         },
         {
           _id: "61d1f4cdc144068a5ae8ba91",
           image: "/images/NissanTrail3.jpg",
           name: "Nissan Trail 3",
           rentPerHour: "60eur/ ",
           bookedTimeSlots: []
         },
         {
           _id: "61d1f4cdc144068a5ae8ba92",
           name: "Opel Corsa 6",
           image: "/images/OpelCorsa6.jpg",
           rentPerHour: "45eur/ ",
           bookedTimeSlots: []
         },
         {
           _id: "61d1f4cdc144068a5ae8ba93",
           name: "Renault Clio 4",
           image: "/images/RenaultClio4.jpg",
           rentPerHour: "52eur/ ",
           bookedTimeSlots: []
         },
         {
           _id: "61d1f4cdc144068a5ae8ba94",
           name: ",Renault Megane 3",
           image: "/images/RenaultMegane3.jpg",
           rentPerHour: "55eur/ ",
           bookedTimeSlots: []
         },
         {
           _id: "61d1f4cdc144068a5ae8ba95",
           name: "Toyota Auris 2",
           image: "/images/ToyotaAuris2.jpg",
           rentPerHour: "45USD/ ",
           bookedTimeSlots: []
         },
       ];
     
     carsData.forEach(async (car) => {
      const car2 = new Car(car);
      await car2.save();
     }); */
   })
   connection.on('error', () => {
      console.log('Mongo DB Connection Error')
   })
}


connectDB()
module.exports = mongoose
