import { Box, Button, Stack, Typography } from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import { loadStaffType } from 'features/Authorization/slice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomerList from './components/CustomerList';
import AddEditCustomer from './pages/AddEditCustomer';
import { loadCustomers } from './slice';

const headCells = [
  {
    id: 'name',
    align: 'left',
    label: 'Tên',
  },
  {
    id: 'email',
    align: 'left',
    label: 'Email',
  },
  {
    id: 'phoneNum',
    align: 'left',
    label: 'Số điện thoại',
  },
];

export default function Customer() {
  const dispatch = useDispatch();
  const [openAddEditCustomer, setOpenAddEditCustomer] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      dispatch(openBackdrop());

      const action = loadCustomers();
      const response = await dispatch(action);

      if (response.payload.success) {
        // Create row table
        const tempRows = [];
        response.payload.allCustomers.forEach(item => {
          const tempRow = {};
          tempRow.id = item._id;
          tempRow.name = item.name;
          tempRow.avatarUrl = item.avatar;
          tempRow.email = item.email;
          tempRow.phoneNum = item.phoneNumber;
          tempRows.push(tempRow);
        });
        setRows(tempRows);
      }
      await dispatch(loadStaffType());

      dispatch(closeBackdrop());
    };
    load();
  }, []);

  const handleOpenAddEditCustomer = () => {
    setOpenAddEditCustomer(true);
  };

  const handleCloseAddEditCustomer = () => {
    setOpenAddEditCustomer(false);
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
            Khách hàng
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
              onClick={handleOpenAddEditCustomer}
              color="secondary"
            >
              Thêm khách hàng
            </Button>
          </Stack>
        </Stack>
        <CustomerList rows={rows} setRows={setRows} headCells={headCells} />
      </Box>
      <AddEditCustomer
        onClose={handleCloseAddEditCustomer}
        open={openAddEditCustomer}
        setRows={setRows}
        staffId={null}
      />
    </>
  );
}
