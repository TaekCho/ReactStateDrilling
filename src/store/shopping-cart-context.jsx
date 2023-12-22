import { createContext, useReducer } from "react";

import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  items: [],
  // Dummy function added to help auto-completion
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

function shoppingCartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state, // unnecessary as the state has only one value
      items: updatedItems,
    };
  }

  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  return state;
}

export default function CartContextProvider({ children }) {
  // the second parameter of the useReducer sets an initial state
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    }
  );

  // const [shoppingCart, setShoppingCart] = useState({
  //   items: [],
  // });

  // function handleAddItemToCart(id) { removed as adding a reducer => 1

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        // we can write codes this way when the var to name is the same as the parameter.
        productId,
        amount,
      },
    });
  }

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}

// function handleAddItemToCart(id) {
//   shoppingCartDispatch({
//     type: 'ADD_ITEM',
//     payload: id,
//   });

//   setShoppingCart((prevShoppingCart) => {
//     const updatedItems = [...prevShoppingCart.items];

//     const existingCartItemIndex = updatedItems.findIndex(
//       (cartItem) => cartItem.id === id
//     );
//     const existingCartItem = updatedItems[existingCartItemIndex];

//     if (existingCartItem) {
//       const updatedItem = {
//         ...existingCartItem,
//         quantity: existingCartItem.quantity + 1,
//       };
//       updatedItems[existingCartItemIndex] = updatedItem;
//     } else {
//       const product = DUMMY_PRODUCTS.find((product) => product.id === id);
//       updatedItems.push({
//         id: id,
//         name: product.title,
//         price: product.price,
//         quantity: 1,
//       });
//     }

//     return {
//       items: updatedItems,
//     };
//   });
// } => 1

// setShoppingCart((prevShoppingCart) => {
//   const updatedItems = [...prevShoppingCart.items];
//   const updatedItemIndex = updatedItems.findIndex(
//     (item) => item.id === productId
//   );

//   const updatedItem = {
//     ...updatedItems[updatedItemIndex],
//   };

//   updatedItem.quantity += amount;

//   if (updatedItem.quantity <= 0) {
//     updatedItems.splice(updatedItemIndex, 1);
//   } else {
//     updatedItems[updatedItemIndex] = updatedItem;
//   }

//   return {
//     items: updatedItems,
//   };
// });
