import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import SearchNotFound from 'components/SearchNotFound';
import TableHeader from 'components/TableHeader';
import TableToolbar from 'components/TableToolbar';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import getComparator from 'utils/Table/getComparator';
import getFilter from 'utils/Table/getFilter';
import stableSortFilter from 'utils/Table/stableSortFilter';

function AuthorizationList(props) {
  const { rows, setRows, headCells, listEdited, setListEdited } = props;
  const staffType = useSelector(state => state.staffTypes.current);
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
    getFilter(filterString, 'funcName'),
  );

  const handleFilterByFuncName = event => {
    setFilterString(event.target.value);
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
      <Paper sx={{ width: '100%', mb: 2 }} elevation={3}>
        <TableToolbar
          filter={filterString}
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
            {isFuncNotFound && (
              <SearchNotFound message="Không tìm thấy chức năng" />
            )}
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default AuthorizationList;
