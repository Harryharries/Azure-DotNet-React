import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { createUser } from "../usersSlice";
import { validateEmail } from "../../../shared/pipe/validateEmail";
import { tokens } from "../../../shared/style/theme";

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({ open, onClose }) => {
  //style provider
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // local state to manage the form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState(false);
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // Get loading, `createUserStatus`, and `error` from the Redux store
  // if it is loading, show spinner on the button instead of close it
  const loading = useSelector((state: RootState) => state.users.loading);
  // createUserStatus shows if the createUserStatus async action to fetch data success or not
  const createUserStatus = useSelector(
    (state: RootState) => state.users.createUserStatus
  );
  const error = useSelector((state: RootState) => state.users.error);
  
  // Close the dialog when `createUserStatus` changes to "fulfilled"
  // Show Error for fail to request `createUserStatus` So user can edit their input on the form
  useEffect(() => {
    if (createUserStatus === "fulfilled") {
      onClose();
    }
  }, [createUserStatus, onClose]);

  // Set `duplicateEmail` state value when `error` changes
  useEffect(() => {
      setDuplicateEmail(error === "The email is already exist");
  }, [error]);

  // Reset state values when the dialog is closed
  useEffect(() => {
    if (!open) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setFirstNameTouched(false);
      setLastNameTouched(false);
      setEmailTouched(false);
    }
  }, [dispatch, open]);

  // Handle form submission, check all the field
  const handleSubmit = (event: React.FormEvent) => {
    setFirstNameTouched(true)
    setLastNameTouched(true)
    setEmailTouched(true)   
    event.preventDefault();
    if (!validateFields()) {
      return;
    }
    dispatch(createUser({ first_name: firstName, last_name: lastName, email }));
  };

   // Validate all the form fields
  const validateFields = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      validateEmail(email.trim())
    );
  };
    // Regular expression to validate email format
  const emailError = emailTouched && !validateEmail(email);
  const firstNameError = firstNameTouched && firstName.trim() === "";
  const lastNameError = lastNameTouched && lastName.trim() === "";
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle my={2}>
        <div>
          <Typography variant="h5" color={colors.greenAccent[400]}>
            Create New Item
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: colors.blueAccent[400],
                },
                "&:hover fieldset": {
                  borderColor: colors.blueAccent[200],
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.blueAccent[500],
                },
              },
              "& .MuiInputLabel-outlined": {
                color: colors.blueAccent[200],
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: colors.blueAccent[500],
              },
            }}
    >
        <form onSubmit={handleSubmit}>
          <Box display="flex" pb={3} justifyContent="space-between">
            <TextField
              margin="dense"
              label="First Name"
              type="text"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setFirstNameTouched(true)}
              error={firstNameError}
              helperText={firstNameError ? "First name is required" : ""}
              sx={{ marginRight: 1, flexGrow: 1, height: "72px" }}
            />
            <TextField
              margin="dense"
              label="Last Name"
              type="text"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => setLastNameTouched(true)}
              error={lastNameError}
              helperText={lastNameError ? "Last name is required" : ""}
              sx={{ marginRight: 1, flexGrow: 1, height: "72px" }}
            />
          </Box>
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setDuplicateEmail(false)
            }}
            onBlur={() => {
              setEmailTouched(true)     
            }}
            error={emailError || duplicateEmail}
            helperText={duplicateEmail ? "Email existed" : emailError ? "Invalid email format" : ""}
            sx={{ marginBottom:3, height: "72px" }}
          />
          <DialogActions>
            <Button onClick={onClose} style={{ fontSize:"15px", color: colors.grey[200] }} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" sx={{ fontSize:"15px", color: colors.greenAccent[300] }} disabled={loading}>
              {loading ? (
                // Display spinner if it is loading
                <CircularProgress size={24} />
              ) : (
                "Create"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default UserFormDialog;
