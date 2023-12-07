import { createContext } from "react";

export const CartContext = createContext({
  items: [],
  // Dummy function added to help auto-completion
  addItemToCart: () => {},
});
