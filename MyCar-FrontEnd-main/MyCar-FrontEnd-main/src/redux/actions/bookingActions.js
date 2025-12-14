import axios from "axios";
import { message } from "antd";
import { sendFeedback } from "../../services/sendFeedback";
import emailjs, { init } from "@emailjs/browser";

const tempalteId = "template_m3mrs6r";
const serviceId = "service_col3qlh";
const BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000'
export const bookCar = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });
  await axios
    .post(`${BASE_URL}/api/bookings/bookCar`, reqObj)
    .then((res) => {
      message.success("Success");
      const payment = res.data.payment
      const booking = res.data.newbooking
      dispatch({ type: "LOADING", payload: false });
      init("user_M0Asa0AoFIZHa6aUuPFQm");
      const template_params = {
        start_date: booking.bookedTimeSlots.from,
        from_email: 'taher.chabaane.1@gmailcom',
        from_name: 'My Car Company',
        end_date: booking.bookedTimeSlots.to,
        total_amount: booking.totalAmount,
        user_email : payment.receipt_email,
        
      };
       emailjs.send(serviceId, tempalteId, template_params)
       .then(()=>{
        message.success("Send");

       })
       .catch(err=>{
         message.error("something went wrong,please try later");
       })
      // setTimeout(() => {
      //   window.location.href = "/userbookings";
      // }, 500);
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: "LOADING", payload: true });
      message.error("something went wrong,please try later");
    });
};

export const getAllBookings = () => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await axios.get(
      `${BASE_URL}/api/bookings/getAllBookings`
    );

    dispatch({ type: "GET_ALL_BOOKINGS", payload: response.data });
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOADING", payload: true });
  }
};


// Update app .