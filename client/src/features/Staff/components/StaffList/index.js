import {
  Avatar,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import SearchNotFound from 'components/SearchNotFound';
import TableHeader from 'components/TableHeader';
import TableToolbar from 'components/TableToolbar';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getComparator from 'utils/Table/getComparator';
import getFilter from 'utils/Table/getFilter';
import stableSortFilter from 'utils/Table/stableSortFilter';
import UserMoreMenu from '../UserMoreMenu';

function StaffList(props) {
  const { rows, setRows, headCells, listEdited, setListEdited } = props;
  const staffType = useSelector(state => state.staffType.current);
  const dispatch = useDispatch();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('funcName');
  const [filterString, setFilterString] = useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredFunc = stableSortFilter(
    rows,
    getComparator(order, orderBy),
    getFilter(filterString, 'staffName', 'identityNumber'),
  );

  const handleFilter = event => {
    setFilterString(event.target.value);
  };

  const isStaffNotFound = filteredFunc.length === 0;
  return (
    <>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar
          filter={filterString}
          onFilterName={handleFilter}
          placeholder="Tìm nhân viên..."
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
                const { staffName, avatarUrl, role, identityNumber, phoneNum } =
                  row;
                return (
                  <TableRow hover key={index}>
                    <TableCell component="th" scope="row">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={staffName} src={avatarUrl} />
                        <Typography variant="subtitle2" noWrap>
                          {staffName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">{role}</TableCell>
                    <TableCell align="left">{identityNumber}</TableCell>
                    <TableCell align="left">
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        {phoneNum}
                        <UserMoreMenu />
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {isStaffNotFound && (
              <SearchNotFound message="Không tìm thấy nhân viên" />
            )}
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default StaffList;
