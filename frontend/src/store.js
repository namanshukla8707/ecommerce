import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  newReviewReducer,
  productDetailsReducer,
  productReducer,
} from "./reducers/productReducer";
import CryptoJS from "crypto-js";
import {
  allOrdersReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
} from "./reducers/orderReducer";
import {
  forgotPasswordReducer,
  profileReducer,
  userReducer,
} from "./reducers/userReducers";

import { cartReducer, paymentReducer } from "./reducers/cartReducers";
const reducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  paymentInfo: paymentReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  newReview:newReviewReducer,
});
let data = "";
if (localStorage.getItem("cartItems")) {
  const secret = "tqrfrg23hfjqng&(#&@($&(@*";
  const bytes = CryptoJS.AES.decrypt(localStorage.getItem("cartItems"), secret);

  data = bytes.toString(CryptoJS.enc.Utf8);
}
let data1 ="";
if (localStorage.getItem("shippingInfo")) {
  const secret = "tqrfrg23hfjqng&(#&@($&(@*";
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("shippingInfo"),
    secret
  );

  data1 = bytes.toString(CryptoJS.enc.Utf8);
}
let initialState = {
  cart: {
    cartItems: data!=="" // getting data from local storage
      ? JSON.parse(data) //parse will convert string to object
      : [],
    shippingInfo: data1!=="" // getting data from local storage
      ? JSON.parse(data1) //parse will convert string to object
      : [],
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
