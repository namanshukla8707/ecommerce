/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import "./ConfirmOrder.css";
import { useAlert } from "react-alert";
import { Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { payment } from "../../actions/cartAction";
import { useEffect } from "react";
import { clearErrors, createOrder } from "../../actions/orderAction";
import CryptoJS from "crypto-js";
const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { info } = useSelector((state) => state.paymentInfo);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;
  const address = `${shippingInfo.address},${shippingInfo.city},${shippingInfo.state},${shippingInfo.pinCode},${shippingInfo.country}`;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(payment(totalPrice, user));
  }, [dispatch, totalPrice, alert, error]);
  const data = {
    subtotal,
    tax,
    totalPrice,
    shippingCharges,
  };
  const value = JSON.stringify(data);
  const secret = "tqrfrg23hfjqng&(#&@($&(@*";
  const encrypted = CryptoJS.AES.encrypt(value, secret).toString();
  sessionStorage.setItem("orderInfo", encrypted);
  const proceedToPayment = async (e) => {
    e.preventDefault();
    try {
      const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shippingCharges,
        totalPrice: totalPrice,
        paymentInfo: {
          status: "Pending",
          id: info.order.id,
        },
        razorpay_order_id: info.order.id,
      };
      dispatch(createOrder(order));

      const {
        data: { razorpayApiKey },
      } = await axios.get("/api/payment/razorpayApiKey");
      const options = {
        key: razorpayApiKey,
        amount: info.amount,
        one_click_checkout: true,
        name: "Naman Shukla",
        image: user.url,
        order_id: info.order.id,
        show_coupons: true,
        callback_url: "http://localhost:4000/api/payment/verification",
        prefill: {
          name: user.name,
          email: user.email,
          contact: "9000090000",
          coupon_code: "COUPON50",
        },
        theme: {
          color: "#eb4034",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      alert.error("Reload the page or else check the internet connection");
    }
  };
  return (
    <>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmShippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmShippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <span>
                      {item.quantity} X ₹{item.price} =
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>
            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>
            <button onClick={proceedToPayment}>Proceed to Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
