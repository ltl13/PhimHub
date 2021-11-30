import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { ErrorSnackBar, SuccessSnackBar } from 'components/SnackBar';
import { loadStaffType } from 'features/Authorization/slice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StaffList from './components/StaffList';
import AddEditStaff from './pages/AddEditStaff';
import { loadStaffs } from './slice';

const headCells = [
  {
    id: 'staffName',
    align: 'left',
    label: 'Tên',
  },
  {
    id: 'role',
    align: 'left',
    label: 'Chức vụ',
  },
  {
    id: 'identityNumber',
    align: 'left',
    label: 'CMND/CCCD',
  },
  {
    id: 'phoneNum',
    align: 'left',
    label: 'Số điện thoại',
  },
];

export default function Staff() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffs = useSelector(state => state.staffs.current);
  const [openSnackBarSuccess, setOpenSnackBarSuccess] = React.useState(false);
  const [openSnackBarError, setOpenSnackBarError] = React.useState(false);
  const [messageSnackBar, setMessageSnackBar] = React.useState('');
  const [openAddEditStaff, setOpenAddEditStaff] = React.useState(false);
  const [isAddEditStaffSuccess, setIsAddEditStaffSuccess] =
    React.useState(false);
  const [listEdited, setListEdited] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      const action = loadStaffs();
      const response = await dispatch(action);

      if (response.payload.success) {
        // Create row table
        const tempRows = [];
        response.payload.allStaffs.forEach(item => {
          const tempRow = {};
          tempRow.id = item._id;
          tempRow.staffName = item.name;
          tempRow.avatarUrl = item.avatar;
          tempRow.role = item.staffType.typeName;
          tempRow.identityNumber = item.identityNumber;
          tempRow.phoneNum = item.phoneNumber;
          tempRows.push(tempRow);
        });
        setRows(tempRows);
      }
      await dispatch(loadStaffType());
    };
    load();
  }, []);

  const handleUpdate = async () => {
    // setOpenBackdrop(true);
    // const response = await dispatch(updateAllStaffType({ data: exportData() }));
    // if (response.payload.success) {
    //   setListEdited([]);
    //   setMessageSnackBar(response.payload.message);
    //   setOpenSnackBarSuccess(true);
    // } else {
    //   setMessageSnackBar(response.payload.message);
    //   setOpenSnackBarError(true);
    // }
    // setOpenBackdrop(false);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBarSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBarError(false);
  };

  const handleOpenAddEditStaff = () => {
    setOpenAddEditStaff(true);
  };

  const handleCloseAddEditStaff = () => {
    setOpenAddEditStaff(false);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <SuccessSnackBar
          open={openSnackBarSuccess}
          handleClose={handleCloseSuccess}
          message={messageSnackBar}
        />
        <ErrorSnackBar
          open={openSnackBarError}
          handleClose={handleCloseError}
          message={messageSnackBar}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Nhân viên
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Button
              variant="contained"
              mr={1}
              onClick={handleOpenAddEditStaff}
              color="secondary"
            >
              Thêm nhân viên
            </Button>
          </Stack>
        </Stack>
        <StaffList
          rows={rows}
          setRows={setRows}
          headCells={headCells}
          listEdited={listEdited}
          setListEdited={setListEdited}
        />
      </Box>
      <AddEditStaff
        onClose={handleCloseAddEditStaff}
        open={openAddEditStaff}
        setRows={setRows}
        staffId={null}
      />
    </>
  );
}
