import axios from "axios";
import {
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  CLEAR_ERRORS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
} from "../constants/productConstants";

export const getProduct =
  (keyword = "", currentPage = 1, price = [0, 25000], category, rating = 0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCT_REQUEST });

      let link = `/api/product/fetchallproducts?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${rating}`;
      if (category) {
        link = `/api/product/fetchallproducts?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&rating[gte]=${rating}`;
      }
      const { data } = await axios.get(link);
      dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/product/getproductdetail/${id}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};


export const newReview = (reviewData ) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const config = {
      headers:{"Content-Type":"application/json"}
    }
    const { data } = await axios.put(`/api/product/createproductreview`,reviewData,config);
    dispatch({ type: NEW_REVIEW_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};