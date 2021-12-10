import { Box, Button, Stack, Typography } from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import { openSnackBar } from 'app/snackBarSlice';
import Function from 'constants/function';
import AddStaffType from 'features/Authorization/pages/AddStaffType';
import { updateAllStaffType } from 'features/Authorization/slice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthorizationList from './components/AuthorizationList/index';
import { loadStaffType } from './slice';

export default function Authorization() {
  const dispatch = useDispatch();
  const staffType = useSelector(state => state.staffTypes.current);
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
    dispatch(openBackdrop());

    const response = await dispatch(updateAllStaffType({ data: exportData() }));

    if (response.payload.success) {
      setListEdited([]);
      dispatch(
        openSnackBar({ type: 'success', message: response.payload.message }),
      );
    } else {
      dispatch(
        openSnackBar({ type: 'error', message: response.payload.message }),
      );
    }
    dispatch(closeBackdrop());
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
