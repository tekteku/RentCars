import axios from "axios"
import emailjs from '@emailjs/browser'
const tempalteId = 'template_m3mrs6r'
const serviceId= 'service_col3qlh'
export const sendFeedback = async(bookingInfo)=>{
    console.log('inside sendFeedback');
    const result = await emailjs.send(serviceId,tempalteId,{from_name: 'My email' , message_html: 'Hello', reply_to: bookingInfo})
    console.log(result);
}