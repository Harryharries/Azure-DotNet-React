import React, { ChangeEvent, useState, KeyboardEvent, useEffect } from "react";
import { Box, TextField, Button, IconButton, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../usersSlice";
import { tokens } from "../../../shared/style/theme";

const UsersFilterComponent: React.FC = () => {
  //style provider
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Get the dispatch function and the filter state from the store
  const dispatch = useDispatch<AppDispatch>();
  const filter = useSelector((state: RootState) => state.users.filter);

 // Local state to manage filter field to cooperate with filter state from the redux store
  const [filterString, setFilterString] = useState("");


  // Update the filter string state when the redux filter state changes
  useEffect(() => {
    setFilterString(filter?filter:"")
  }, [filter]);

  const handleClearFilter = () => {
    if (filter !== "") {
      dispatch(setFilter(""));
    }
  };
  // Set the filter state to the current filter string when the search button is clicked
  // I did not use the type input hook, it may send too much request for one search
  // e.g. to search "har" might be search 3 times "h", "ha", "har"
  // Reccommand: to remove the search button properly, we could add new lab "Rxjs" to create a Observiable for it
  //             Observiable can be piped with a debouncetime(xxx) and  swicthmap() to cancel all the unnecessary request
  //             in the example gived, "h", "ha", search request will be cancelled and only send the last search "har"
  //             Then, we can remove the search button and use the type input hook to trigger the search
  const handleSearch = () => {
    dispatch(setFilter(filterString));
  };

  // Only Handle the enter key press to trigger search
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="start"
      mb={2}
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
      gap="10px"
    >
      <TextField
        label="General Filter"
        variant="outlined"
        size="small"
        value={filterString}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setFilterString(e.target.value)
        }
        onKeyPress={handleKeyPress}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        style={{ backgroundColor: colors.greenAccent[400] }}
      >
        Search
      </Button>
      <IconButton
       style={{ color: colors.grey[200] }}
        aria-label="clear filter"
        onClick={handleClearFilter}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default UsersFilterComponent;
