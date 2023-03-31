import React from "react";
import store from "../../redux/store";
import { Provider } from "react-redux";
import { Users } from "../../feature/users";
import { SnackbarProvider } from "../../Core/SnackbarContext";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ColorModeContext,useMode } from "../../shared/style/theme";

const UserContainer: React.FC = () => {
  // Use the Custom `useMode` hook to provide style to component
  const [theme, colorMode] = useMode();

  return (
    // Provide the `colorMode` value from the `useMode` hook to the `ColorModeContext.Provider` and all children
    // with Redux store services, Snackbar services
    <ColorModeContext.Provider value={colorMode}>
    <React.StrictMode>
        <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
            <div className="App">
                <Users />
            </div>
            </SnackbarProvider>
        </ThemeProvider>
        </Provider>
    </React.StrictMode>
  </ColorModeContext.Provider>

  );
};

export default UserContainer;