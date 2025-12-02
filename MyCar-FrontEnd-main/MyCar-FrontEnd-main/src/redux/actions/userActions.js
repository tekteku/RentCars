import axios from "axios";
import { message } from "antd";
const BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000'
export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });
  console.log("redux userLogin: ", reqObj);
  try {
    const response = await axios.post(`${BASE_URL}/api/users/login`, reqObj);
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(response.data));
    message.success("Login Success");
    dispatch({ type: "GET_ALL_CARS", payload: response.data });
    dispatch({ type: "LOADING", payload: false });
    message.success("Registration successfull");
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  } catch (error) {
    console.log(error);
    message.error("something wrong");
    dispatch({ type: "LOADING", payload: false });
  }
};
export const userRegister = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });
  console.log("register: ", reqObj);

  try {
    const response = await axios.post(`${BASE_URL}/api/users/register`, reqObj);
    



    console.log("register  success: ", response);
    message.success("Registration successfull");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    message.error("Something went wrong");
    dispatch({ type: "LOADING", payload: false });
  }
};
 // Update
 // update