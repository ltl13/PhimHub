import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getComparator from 'utils/getComparator';
import stableSortFilter from 'utils/stableSortFilter';
import TableHeader from '../../../../components/TableHeader';
import TableToolbar from '../../../../components/TableToolbar';

function AuthorizationList(props) {
  const { rows, setRows, headCells, listEdited, setListEdited } = props;
  const staffType = useSelector(state => state.staffType.current);
  const dispatch = useDispatch();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('funcName');
  const [filterFuncName, setFilterFuncName] = useState('');

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
    const EditedIndex = listEdited.indexOf(name);
    let newListEdited = [];
    if (EditedIndex === -1) {
      newListEdited = newListEdited.concat(listEdited, name);
    } else if (EditedIndex === 0) {
      newListEdited = newListEdited.concat(listEdited.slice(1));
    } else if (EditedIndex === listEdited.length - 1) {
      newListEdited = newListEdited.concat(listEdited.slice(0, -1));
    } else if (EditedIndex > 0) {
      newListEdited = newListEdited.concat(
        listEdited.slice(0, EditedIndex),
        listEdited.slice(EditedIndex + 1),
      );
    }
    setListEdited(newListEdited);
  };

  const handleClickCheckbox = (funcName, id) => {
    const index = rows.map(r => r.funcName).indexOf(funcName);
    rows[index][id] = !rows[index][id];
    setRows(rows);
    addItemEdited(`${index}-${id}`);
  };

  const isFuncNotFound = filteredFunc.length === 0;
  return (
    <>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar
          filterName={filterFuncName}
          onFilterName={handleFilterByFuncName}
          placeholder="Tìm chức năng..."
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
