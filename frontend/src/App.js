import "./App.css";
import Header from "./component/layout/Header/Header.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
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

function App() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roborto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);
  return (
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
          (isAuthenticated ? (
            <Route exact path="/account" element={<Profile />} />
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          ))}
        {!loading &&
          (isAuthenticated ? (
            <Route exact path="/me/update" element={<UpdateProfile />} />
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          ))}
        {!loading &&
          (isAuthenticated ? (
            <Route exact path="/password/update" element={<UpdatePassword />} />
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
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
          (isAuthenticated ? (
            <Route exact path="/shipping" element={<Shipping />} />
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          ))}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
