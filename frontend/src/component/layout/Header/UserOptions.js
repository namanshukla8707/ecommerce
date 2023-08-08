/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Header.css";
import { SpeedDialAction } from "@mui/material";
import { SpeedDial } from "@material-ui/lab";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import Backdrop from "@material-ui/core/Backdrop";

const UserOptions = ({ user }) => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const [open, setOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: <ShoppingCartIcon style={{color:cartItems.length>0?"#eb4034":"unset"}} />,
      name: `Cart(${cartItems.length})`, func: cart
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];
  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }
  function dashboard() {
    history("/dashboard");
  }
  function orders() {
    history("/orders");
  }
  function account() {
    history("/account");
  }
  function cart() {
    history("/cart");
  }
  function logoutUser() {
    dispatch(logout());
    alert.success("Logout Successfully");
  }

  return (
    <>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => {
          setOpen(true);
        }}
        className="speedDail"
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        icon={
          <img
            className="speedDailIcon"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="userImage"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth<=600?true:false}
          ></SpeedDialAction>
        ))}
      </SpeedDial>
    </>
  );
};

export default UserOptions;
