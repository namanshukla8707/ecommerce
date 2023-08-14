/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import Header from "./component/layout/Header/Header.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import WebFont from "webfontloader";
import React, { useState } from "react";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import { loadUser } from "./actions/userAction";
import store from "./store";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfie.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import OrderPayment from "./component/Cart/Payment";
import axios from "axios";
import Loader from "./component/layout/Loader/Loader";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
function App() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const [razorpayApiKey, setRazorpayApiKey] = useState("");

  async function getRazorpayApiKey() {
    const { data } = await axios.get("/api/payment/razorpayApiKey");
    setRazorpayApiKey(data.razorpayApiKey);
  }
  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roborto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    if (isAuthenticated) {
      getRazorpayApiKey();
    }
  }, []);

  return (
    <>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/product/:id" element={<ProductDetails />} />
          <Route exact path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route exact path="/search" element={<Search />} />
          {!loading &&
            (isAuthenticated === false ? (
              <Route path="*" element={<Navigate to="/login" />} />
            ) : (
              <Route exact path="/account" element={<Profile />} />
            ))}
          {!loading &&
            (isAuthenticated === false ? (
              <Route path="*" element={<Navigate to="/login" />} />
            ) : (
              <Route exact path="/me/update" element={<UpdateProfile />} />
            ))}
          {!loading &&
            (isAuthenticated === false ? (
              <Route path="*" element={<Navigate to="/login" />} />
            ) : (
              <Route
                exact
                path="/password/update"
                element={<UpdatePassword />}
              />
            ))}
          <Route exact path="/password/forgot" element={<ForgotPassword />} />
          <Route
            exact
            path="/password/reset/:token"
            element={<ResetPassword />}
          />
          <Route exact path="/login" element={<LoginSignUp />} />
          <Route exact path="/cart" element={<Cart />} />
          {!loading &&
            (isAuthenticated === false ? (
              <Route path="*" element={<Navigate to="/login" />} />
            ) : (
              <Route exact path="/shipping" element={<Shipping />} />
            ))}
          {!loading &&
            (isAuthenticated === false ? (
              <Route path="*" element={<Navigate to="/login" />} />
            ) : (
              <Route exact path="/order/confirm" element={<ConfirmOrder />} />
            ))}
          {!loading &&
            (isAuthenticated === false ? (
              <Route path="*" element={<Navigate to="/login" />} />
            ) : (
              <Route
                exact
                path="/paymentCompleted"
                element={<OrderPayment />}
              />
            ))}
          {!loading &&
            (isAuthenticated === false ? (
              <Route path="*" element={<Navigate to="/login" />} />
            ) : (
              <Route exact path="/orders" element={<MyOrders />} />
            ))}
          {!loading &&
            (isAuthenticated === false ? (
              <Route path="*" element={<Navigate to="/login" />} />
            ) : (
              <Route exact path="/order/:id" element={<OrderDetails />} />
            ))}
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;