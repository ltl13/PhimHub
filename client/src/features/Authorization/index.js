import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { ErrorSnackBar, SuccessSnackBar } from 'components/SnackBar';
import Function from 'constants/function';
import AddStaffType from 'features/Authorization/pages/AddStaffType';
import { updateAllStaffType } from 'features/Authorization/slice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthorizationList from './components/AuthorizationList/index';
import { loadStaffType } from './slice';

export default function Authorization() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffType = useSelector(state => state.staffType.current);
  const [openSnackBarSuccess, setOpenSnackBarSuccess] = React.useState(false);
  const [openSnackBarError, setOpenSnackBarError] = React.useState(false);
  const [messageSnackBar, setMessageSnackBar] = React.useState('');
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [openAddStaffType, setOpenAddStaffType] = React.useState(false);
  const [isAddStaffTypeSuccess, setIsAddStaffTypeSuccess] =
    React.useState(false);
  const [listEdited, setListEdited] = useState([]);
  const [rows, setRows] = useState([]);
  const [headCells, setHeadCells] = useState([]);

  const createHeadCells = data => {
    const newHeadCells = [
      {
        id: 'funcName',
        align: 'left',
        label: 'Chức năng',
      },
    ];
    const tempHeadCells = data.map(({ _id, typeName }) => ({
      id: _id,
      label: typeName,
      align: 'center',
    }));
    setHeadCells(newHeadCells.concat(tempHeadCells));
  };

  useEffect(() => {
    const load = async () => {
      const action = loadStaffType();
      const response = await dispatch(action);
      if (response.payload.success) {
        //create headCell data
        createHeadCells(response.payload.allStaffTypes);

        //Create row table
        const tempRows = [];
        Object.keys(Function).forEach(key => {
          const temp = {};
          temp['id'] = Function[key].id;
          temp['funcName'] = Function[key].displayName;
          if (response.payload) {
            response.payload.allStaffTypes.forEach(({ _id, funcs }) => {
              temp[_id] = funcs.some(func => func._id === Function[key].id);
            });
          }
          tempRows.push(temp);
        });
        setRows(tempRows);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (staffType) createHeadCells(staffType);
  }, [isAddStaffTypeSuccess]);

  const exportData = () => {
    const data = [];
    staffType.forEach(staffType => {
      const tempStaffType = { id: staffType._id, funcs: [] };
      rows.forEach(row => {
        if (row[staffType._id]) tempStaffType.funcs.push(row.id);
      });
      data.push(tempStaffType);
    });

    return data;
  };

  const handleUpdate = async () => {
    setOpenBackdrop(true);
    const response = await dispatch(updateAllStaffType({ data: exportData() }));
    if (response.payload.success) {
      setListEdited([]);
      setMessageSnackBar(response.payload.message);
      setOpenSnackBarSuccess(true);
    } else {
      setMessageSnackBar(response.payload.message);
      setOpenSnackBarError(true);
    }
    setOpenBackdrop(false);
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

  const handleOpenAddStaffType = () => {
    setOpenAddStaffType(true);
  };

  const handleCloseAddStaffType = () => {
    setOpenAddStaffType(false);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
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
            Phân quyền
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
              onClick={handleOpenAddStaffType}
              sx={{ backgroundColor: 'secondary.main' }}
            >
              Thêm loại nhân viên
            </Button>
            <Button
              disabled={listEdited.length === 0}
              variant="contained"
              onClick={handleUpdate}
            >
              Lưu chỉnh sửa
            </Button>
          </Stack>
        </Stack>
        <AuthorizationList
          rows={rows}
          setRows={setRows}
          headCells={headCells}
          listEdited={listEdited}
          setListEdited={setListEdited}
        />
      </Box>
      <AddStaffType
        onClose={handleCloseAddStaffType}
        open={openAddStaffType}
        isSubmitSuccess={isAddStaffTypeSuccess}
        setIsSubmitSuccess={setIsAddStaffTypeSuccess}
      />
    </>
  );
}
