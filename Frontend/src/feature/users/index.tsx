import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import {
  DataGrid,
  GridPaginationModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import {
  fetchUsersData,
  resetError,
  resetUserState,
  setPageNumber,
  setPageSize,
  resetCreateUserStatus,
} from "./usersSlice";
import Header from "../../shared/component/Header";
import UsersFilterComponent from "./Components/usersFilter";
import UserFormDialog from "./Components/UserFormDialog";
import { formatDate } from "../../shared/pipe/formatDate";
import { useSnackbar } from "../../Core/SnackbarContext";
import { ColorModeContext, tokens } from "../../shared/style/theme";

export const Users: React.FC = () => {
  //dark mode table
  const colorMode = useContext(ColorModeContext);
  // custom style in dark mode
  const theme = useTheme();
  const colors = tokens(theme.palette.mode as "dark" | "light");
  // Using Snackbar services
  const { snackbarShowMessage } = useSnackbar();

  // Get the dispatch function and states from the store
  const dispatch = useDispatch<AppDispatch>();
  const usersData = useSelector((state: RootState) => state.users.users);
  const pageNumber = useSelector((state: RootState) => state.users.pageNumber);
  const pageSize = useSelector((state: RootState) => state.users.pageSize);
  const filter = useSelector((state: RootState) => state.users.filter);
  const totalRowCount = useSelector(
    (state: RootState) => state.users.totalCount
  );
  const loading = useSelector((state: RootState) => state.users.loading);
  const createUserStatus = useSelector(
    (state: RootState) => state.users.createUserStatus
  );
  const error = useSelector((state: RootState) => state.users.error);


   // local state to manage the dialog
  const [open, setOpen] = useState(false);

  // open dialog
  const handleClickOpenUserDialog = () => {
    setOpen(true);
  };

  // if there is a error from server when adding new users,
  // user should be able to exit and open the dialog again
  // without showing the same error
  const handleCloseUserDialog = () => {
    setOpen(false);
    dispatch(resetError());
  };

  // Show a success message when a new user is successfully added
  // set CreateUserStatus back to "idle"
  // then close the dialog
  useEffect(() => {
    if (createUserStatus === "fulfilled") {
      snackbarShowMessage("User created successfully!", "success");
      dispatch(resetCreateUserStatus());
      handleCloseUserDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUserStatus]);

  // Show an error message when an error occurs
  useEffect(() => {
    if (error) {
      snackbarShowMessage(`Error: ${error}`, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // Fetch the users data with the current pagination and filtering settings
  useEffect(() => {
    dispatch(fetchUsersData({ pageNumber, pageSize, filter }));
  }, [dispatch, pageNumber, pageSize, filter]);

  // manage redux paginator
  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.page !== pageNumber - 1) {
      dispatch(setPageNumber(model.page + 1));
    }
    if (model.pageSize !== pageSize) {
      dispatch(setPageSize(model.pageSize));
    }
  };

  // Reset the state when the component is unmounted, So the page always
  // shows page 1 for everytime we get into the user page
  useEffect(() => {
    return () => {
      dispatch(resetUserState());
    };
  }, [dispatch]);


  
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 270,
      cellClassName: "id-column--cell",
      headerClassName: "id-header--cell",
      disableColumnMenu: true,
    },
    {
      field: "first_name",
      headerName: "FirstName",
      width: 150,
      cellClassName: "name-column--cell",
      disableColumnMenu: true,
    },
    {
      field: "last_name",
      headerName: "LastName",
      width: 150,
      cellClassName: "name-column--cell",
      disableColumnMenu: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "date_created",
      headerName: "Created Date",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        formatDate(params.value as string),
      disableColumnMenu: true,
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Users" subtitle="Managing your Users" />
        <Box display="flex" gap={10}>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <Button
            variant="contained"
            style={{ backgroundColor: colors.blueAccent[500] }}
            onClick={handleClickOpenUserDialog}
          >
            New
          </Button>
        </Box>
      </Box>

      <UserFormDialog open={open} onClose={handleCloseUserDialog} />

      {/* // A filter to search generally. it will search user's firstname, lastname,
       firstname + lastname and email */}
      <UsersFilterComponent />

      <Box
        m="40px 0 0 0"
        height="60vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .id-column--cell": {
            paddingLeft: "26px",
          },
          "& .id-header--cell": {
            paddingLeft: "26px", // Adjust the value as needed
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiTablePagination-toolbar": {
            alignItems: "center",
          },
        }}
      >
        <DataGrid
          rows={usersData}
          columns={columns}
          rowCount={totalRowCount}
          paginationMode="server"
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: {
                page: pageNumber - 1,
                pageSize: pageSize,
              },
            },
          }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[30, 10, 25, 50]}
        ></DataGrid>
      </Box>
    </Box>
  );
};
