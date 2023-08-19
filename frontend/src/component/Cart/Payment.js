/* eslint-disable no-unused-vars */
import React from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import "./Payment.css";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CryptoJS from "crypto-js";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
const Payment = () => {
 
  const searchQuery = useSearchParams()[0];
  const payment_id = searchQuery.get("reference");
  return (
    <>
      <MetaData title="Payment Completed" />
      <CheckoutSteps activeStep={2} />
      <div className="orderSuccess">
        <CheckCircleIcon />
        <Typography>
          Your Order has been placed successfully <br /> Payment_Id :{" "}
          <b>{`${payment_id}`}</b>
        </Typography>
        <Link to="/orders">View Orders</Link>
      </div>
    </>
  );
};

export default Payment;
