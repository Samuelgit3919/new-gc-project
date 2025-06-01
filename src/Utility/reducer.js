/* eslint-disable no-case-declarations */
import { Type } from "./action.type";

// Initial state of the reducer
export const initialState = {
  // Initial state of the basket is an empty array
  basket: [],
  user: null, 
};

// Reducer function that takes in the current state and an action
export const reducer = (state, action) => {
  // Switch statement to handle different types of actions
  switch (action.type) {
    // If the action type is ADD_TO_BASKET
    case Type.ADD_TO_BASKET:
      // Find the item in the basket that matches the id of the action item
      const existingItem = state.basket.find(
        (item) => item.id === action.item.id
      );
      // If the item is not found in the basket
      if (!existingItem) {
        // Return a new state with the item added to the basket with an amount of 1
        return {
          ...state,
          basket: [...state.basket, { ...action.item, amount: 1 }],
        };
      } else {
        // Otherwise, update the amount of the existing item in the basket
        const updatedBasket = state.basket.map((item) => {
          // If the item matches the id of the action item, update the amount
          return item.id === action.item.id
            ? { ...item, amount: item.amount + 1 }
            : item;
        });
        // Return a new state with the updated basket
        return { ...state, basket: updatedBasket };
      }
    // If the action type is REMOVE_FROM_BASKET
    case Type.REMOVE_FROM_BASKET:
      // Find the index of the item in the basket that matches the id of the action
      const index = state.basket.findIndex((item) => item.id === action.id);
      // Create a new array that is a copy of the current basket
      let newBasket = [...state.basket];
      // If the item is found in the basket
      if (index >= 0) {
        // If the amount of the item is greater than 1, decrement the amount
        if (newBasket[index].amount > 1) {
          newBasket[index] = {
            ...newBasket[index],
            amount: newBasket[index].amount - 1,
          };
        } else {
          // Otherwise, remove the item from the basket
          newBasket.splice(index, 1);
        }
      }
      // Return a new state with the updated basket
      return { ...state, basket: newBasket };


    case Type.SET_USER:
        return {
          ...state,
          user: action.user
      }
    
    case Type.EMPTY_BASKET:
      return {
        ...state,
        basket: []
      }
    
    // Default case to handle any other action types
    default:
      // Return the current state
      return state;
  }
};
