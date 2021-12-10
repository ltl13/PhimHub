import {
  Avatar,
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
import getComparator from 'utils/Table/getComparator';
import getFilter from 'utils/Table/getFilter';
import stableSortFilter from 'utils/Table/stableSortFilter';
import MovieMoreMenu from '../MovieMoreMenu';

function MovieList(props) {
  const { rows, setRows, headCells } = props;
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
    getFilter(filterString, 'name'),
  );

  const handleFilter = event => {
    setFilterString(event.target.value);
  };

  const isStaffNotFound = filteredFunc.length === 0;
  return (
    <>
      <Paper sx={{ width: '100%', mb: 2 }} elevation={3}>
        <TableToolbar
          filter={filterString}
          onFilterName={handleFilter}
          placeholder="Tìm khách hàng..."
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
                const { name, premiereDate, status } = row;
                return (
                  <TableRow hover key={index}>
                    <TableCell component="th" scope="row">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">
                      {new Date(premiereDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="left">
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        {status ? 'Đang chiếu' : 'Sắp chiếu'}
                        <MovieMoreMenu setRows={setRows} movie={row} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {isStaffNotFound && (
              <SearchNotFound message="Không tìm thấy phim" />
            )}
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default MovieList;
