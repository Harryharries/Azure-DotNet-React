import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";

interface SnackbarContextValue {
  snackbarShowMessage: (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider: React.FC = ({ children }) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const snackbarShowMessage = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = () => {
    setSnackbar((prevState) => ({ ...prevState, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ snackbarShowMessage }}>
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionComponent={Slide as React.ComponentType<SlideProps>}
        >
          <Alert variant="filled" onClose={handleClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
