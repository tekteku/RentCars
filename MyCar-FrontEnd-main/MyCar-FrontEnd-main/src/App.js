import logo from "./logo.svg";
import "./App.css";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingCar from "./pages/BookingCar";
import "antd/dist/antd.css";
import UserBookings from "./pages/UserBookings";
import AddCar from "./pages/AddCar";
import AdminHome from "./pages/AdminHome";
import EditCar from "./pages/EditCar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login"  component={Login} />
          <Route path="/register"  component={Register} />
          <ProtectedRoute path="/userbookings/"  component={UserBookings} />
          <ProtectedRoute path="/booking/:carid" component={BookingCar} />     
          <ProtectedRouteAdmin path="/editcar/:carid"  component={EditCar} />
          <ProtectedRouteAdmin path="/admin"  component={AdminHome} />
          <ProtectedRouteAdmin path="/addcar" component={AddCar} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
export function ProtectedRoute(props) {
  if (localStorage.getItem("user")) {
    return <Route {...props} />;
  } else {
    return <Redirect to="/login" />;
  }
}

export function ProtectedRouteAdmin(props) {
  const admin = JSON.parse( localStorage.getItem("user"));
  /**
   * admin {
   *  username: admin,
   *  ...
   *  role: admin,
   * }
   */
  if (admin?.role === "admin") {
    return <Route {...props} />;
  } else {
    return <Redirect to="/" />;
  }
}
