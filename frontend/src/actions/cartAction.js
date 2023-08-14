import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
  PAYMENT_FAIL,
  PAYMENT_SUCCESS,
} from "../constants/cartConstant";
import axios from "axios";
import CryptoJs from "crypto-js";
// Add item to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/product/getproductdetail/${id}`);
  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      // we are send id in product variabe to cartReducer.
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.stock,
      quantity,
    },
  });
  const value = JSON.stringify(getState().cart.cartItems);
  const secret = "tqrfrg23hfjqng&(#&@($&(@*";
  const encrypted = CryptoJs.AES.encrypt(value, secret).toString();
  localStorage.setItem("cartItems", encrypted);
};

// Remove item from cart
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });
   const value = JSON.stringify(getState().cart.cartItems);
   const secret = "tqrfrg23hfjqng&(#&@($&(@*";
   const encrypted = CryptoJs.AES.encrypt(value, secret).toString();
   localStorage.setItem("cartItems", encrypted);
};

// Saving Shipping Info
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });
  const value = JSON.stringify(data);
  const secret = "tqrfrg23hfjqng&(#&@($&(@*";
  const encrypted = CryptoJs.AES.encrypt(value, secret).toString();
  localStorage.setItem("shippingInfo", encrypted);
};

export const payment = (amount, user) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/payment/checkout",
      { amount, user },
      config
    );
    dispatch({
      type: PAYMENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PAYMENT_FAIL,
      payload: error.response.data.message,
    });
  }
};
