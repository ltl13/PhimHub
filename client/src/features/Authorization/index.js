import Function from 'constants/function';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthorizationList from './components/AuthorizationList/index';
import { loadStaffType } from './slice';
import { useNavigate } from 'react-router-dom';

export default function Authorization() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffType = useSelector(state => state.staffType.current);
  const [rows, setRows] = useState([]);
  const initHeadCells = [
    {
      id: 'funcName',
      align: 'left',
      disablePadding: false,
      label: 'Chức năng',
    },
  ];
  const [headCells, setHeadCells] = useState(initHeadCells);

  useEffect(() => {
    const load = async () => {
      const action = loadStaffType();
      const response = await dispatch(action);
      if (response.payload.success) {
        //create headCell data
        const tempHeadCells = response.payload.allStaffTypes.map(
          ({ _id, typeName }) => ({
            id: _id,
            label: typeName,
            align: 'center',
            disablePadding: false,
          }),
        );
        setHeadCells(initHeadCells.concat(tempHeadCells));

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
  }, [staffType]);

  return (
    <AuthorizationList rows={rows} setRows={setRows} headCells={headCells} />
  );
}
