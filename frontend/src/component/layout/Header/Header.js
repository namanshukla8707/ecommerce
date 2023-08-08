import React from "react";
import { ReactNavbar } from "overlay-navbar";
import { FaUserAlt, FaSearch } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import logo from "../../../images/logo.png";
const Header = () => {
  return (
    <ReactNavbar
      profileIcon={true}
      searchIcon={true}
      cartIcon={true}
      CartIconElement={FiShoppingBag}
      searchIconMargin="5"
      cartIconMargin="5"
      logoHoverSize="10px"
      logoHoverColor="#eb4034"
      link1Text="Home"
      link2Text="Products"
      link3Text="Contact"
      link4Text="About"
      link1Url="/"
      link2Url="/products"
      link3Url="/contact"
      link4Url="/about"
      link1Size="1.3vmax"
      link1Color="rgba(35,35,35,0.8)"
      nav1justifyContent="flex-end"
      nav2justifyContent="flex-end"
      nav3justifyContent="flex-start"
      nav4justifyContent="flex-start"
      link1ColorHover="#eb4034"
      link2ColorHover="#eb4034"
      link3ColorHover="#eb4034"
      link4ColorHover="#eb4034"
      profileIconMargin="5"
      profileIconSize="25px"
      burgerColorHover="#eb4034"
      logo={logo}
      logoWidth="20vmax"
      navColor1="white"
      SearchIconElement={FaSearch}
      ProfileIconElement={FaUserAlt}
      link2Margin="2vmax"
      link3Margin="2vmax"
      link4Margin="2vmax"
      profileIconUrl="/login"
      cartIconUrl="/cart"
      link1Margin="2vmax"
      profileIconColor="rgba(35,35,35,0.8)"
      searchIconColor="rgba(35,35,35,0.8)"
      cartIconColor="rgba(35,35,35,0.8)"
      profileIconColorHover="#eb4034"
      searchIconColorHover="#eb4034"
      cartIconColorHover="#eb4034"
    ></ReactNavbar>
  );
};

export default Header;
