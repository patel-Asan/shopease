


import React from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { FavouritesProvider } from "./FavouritesContext";
import { ThemeProvider } from "./ThemeContext";
import { NotificationProvider } from "./NotificationContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <FavouritesProvider>
              {children}
            </FavouritesProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
