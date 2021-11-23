import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { ErrorSnackBar, SuccessSnackBar } from 'components/SnackBar';
import AddStaffType from 'features/Authorization/pages/AddStaffType';
import { updateAllStaffType } from 'features/Authorization/slice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import descendingComparator from 'utils/descendingComparator';
import removeAccents from 'utils/removeAccents';
import AuthorizationListToolbar from '../AuthorizationListTollbar';
import TableHeader from '../TableHeader';

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  if (query) {
    return array.filter(
      func =>
        removeAccents(func.funcName.toLowerCase()).indexOf(
          removeAccents(query.toLowerCase()),
        ) !== -1,
    );
  }
  return stabilizedThis.map(el => el[0]);
}

function AuthorizationList(props) {
  const { rows, setRows, headCells } = props;
  const staffType = useSelector(state => state.staffType.current);
  const dispatch = useDispatch();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('funcName');
  const [filterFuncName, setFilterFuncName] = useState('');
  const [edited, setEdited] = useState([]);
  const [openSnackBarSuccess, setOpenSnackBarSuccess] = React.useState(false);
  const [openSnackBarError, setOpenSnackBarError] = React.useState(false);
  const [messageSnackBar, setMessageSnackBar] = React.useState('');
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [openAddStaffType, setOpenAddStaffType] = React.useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredFunc = stableSortFilter(
    rows,
    getComparator(order, orderBy),
    filterFuncName,
  );

  const handleFilterByFuncName = event => {
    setFilterFuncName(event.target.value);
  };

  const addItemEdited = name => {
    const EditedIndex = edited.indexOf(name);
    let newEdited = [];
    if (EditedIndex === -1) {
      newEdited = newEdited.concat(edited, name);
    } else if (EditedIndex === 0) {
      newEdited = newEdited.concat(edited.slice(1));
    } else if (EditedIndex === edited.length - 1) {
      newEdited = newEdited.concat(edited.slice(0, -1));
    } else if (EditedIndex > 0) {
      newEdited = newEdited.concat(
        edited.slice(0, EditedIndex),
        edited.slice(EditedIndex + 1),
      );
    }
    setEdited(newEdited);
  };

  const handleClickCheckbox = (funcName, id) => {
    const index = rows.map(r => r.funcName).indexOf(funcName);
    rows[index][id] = !rows[index][id];
    setRows(rows);
    addItemEdited(`${index}-${id}`);
  };

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
      setEdited([]);
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

  const isFuncNotFound = filteredFunc.length === 0;
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
            <Button variant="contained" mr={1} onClick={handleOpenAddStaffType}>
              Thêm loại nhân viên
            </Button>
            <Button
              disabled={edited.length === 0}
              variant="contained"
              onClick={handleUpdate}
            >
              Lưu chỉnh sửa
            </Button>
          </Stack>
        </Stack>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <AuthorizationListToolbar
            filterName={filterFuncName}
            onFilterName={handleFilterByFuncName}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHeader
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={headCells}
              />
              <TableBody>
                {filteredFunc.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover key={row.funcName}>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.funcName}
                      </TableCell>
                      {staffType &&
                        staffType.map((item, index) => (
                          <TableCell align="center" key={index}>
                            <Checkbox
                              checked={row[item._id]}
                              onClick={() => {
                                handleClickCheckbox(row.funcName, item._id);
                              }}
                            />
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })}
              </TableBody>
              {isFuncNotFound && <SearchNotFound />}
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <AddStaffType onClose={handleCloseAddStaffType} open={openAddStaffType} />
    </>
  );
}

function SearchNotFound() {
  return (
    <TableBody>
      <TableRow>
        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
          <Typography gutterBottom align="center" variant="subtitle1">
            Không có chức năng
          </Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
export default AuthorizationList;
