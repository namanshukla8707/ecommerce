import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
  PAYMENT_FAIL,
  PAYMENT_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/cartConstant";
export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      // i.product here is product id and item.product is item id.
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      // Replacing the item in the cart
      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        // adding item to cart if it is not present in the cart.
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload), // all expect the removing product are stored in cartitems
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };
    default:
      return state;
  }
};

// payment reducer
export const paymentReducer = (state = { info: {} }, action) => {
  switch (action.type) {
    case PAYMENT_SUCCESS:
      return {
        ...state,
        info:action.payload,
      };
    case PAYMENT_FAIL:
      return {
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
