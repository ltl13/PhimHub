import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Button,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Divider,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { styled } from '@mui/system';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import { getRoomTypeById } from './roomTypeSlice';
import { getAllSeatType } from './seatTypeSlice';
import MenuWithArrow from 'components/Menu';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import numToAlphabet from 'utils/numToAlphabet';

const headCells = [
  {
    id: 'name',
    align: 'left',
    label: 'Tên',
  },
  {
    id: 'premiereDate',
    align: 'left',
    label: 'Ngày phát hành',
  },
  {
    id: 'status',
    align: 'left',
    label: 'Trạng thái',
  },
];

export default function Room() {
  const dispatch = useDispatch();
  const [seats, setSeats] = useState([]);
  const [seatType, setSeatType] = useState({});
  const [selectedRow, setSelectedRow] = useState(-1);
  const [selectedRowForSetSeatType, setSelectedRowForSetSeatType] =
    useState(-1);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [idEmptySeatType, setIdEmptySeatType] = useState('');

  useEffect(() => {
    const load = async () => {
      dispatch(openBackdrop());

      const responseSeatType = await dispatch(getAllSeatType());
      if (responseSeatType.payload.success) {
        // Create row table
        const newSeatType = {};

        responseSeatType.payload.allSeatTypes.forEach(type => {
          newSeatType[type._id] = type;
          if (type.typeName === '#') setIdEmptySeatType(type._id);
        });

        setSeatType(newSeatType);
      }

      const responseRoomType = await dispatch(
        getRoomTypeById({ id: '61b1c139e15673926a17b3fa' }),
      );
      if (responseRoomType.payload.success) {
        // Create row table

        setSeats(responseRoomType.payload.roomType.seats);
      }
      dispatch(closeBackdrop());
    };
    load();
  }, []);

  const handleDeleteRow = () => {
    if (seats.length > 1) {
      setSeats(prev => {
        prev.splice(selectedRow, 1);
        return [...prev];
      });
    }
  };

  const handleAddRowAbove = () => {
    setSeats(prev => {
      const newRow = [];
      for (let i = 0; i < seats[0].length; i++) newRow.push(idEmptySeatType);

      prev.splice(selectedRow, 0, newRow);
      return [...prev];
    });
  };

  const handleAddRowBelow = () => {
    setSeats(prev => {
      const newRow = [];
      for (let i = 0; i < seats[0].length; i++) newRow.push(idEmptySeatType);

      if (selectedRow === prev.length - 1) return prev.concat([newRow]);

      prev.splice(selectedRow + 1, 0, newRow);
      return [...prev];
    });
  };

  const handleSetSeatTypeForRow = id => {
    setSeats(prev => {
      const newRow = [];

      const length =
        seatType[id].size === 2 && seats[0].length % 2 !== 0
          ? seats[0].length - 1
          : seats[0].length;
      for (let i = 0; i < length; i++) newRow.push(id);

      if (length < seats[0].length) newRow.push(idEmptySeatType);

      prev.splice(selectedRowForSetSeatType, 1, newRow);
      return [...prev];
    });
  };

  const [anchorElMenuEditRowCol, setAnchorElMenuEditRowCol] = useState(null);

  const handleCloseMenuEditRowCol = () => {
    setAnchorElMenuEditRowCol(null);
    setSelectedRow(-1);
    setSelectedColumn(-1);
  };

  const handleClickRowOrColumn = event => {
    setAnchorElMenuEditRowCol(event.currentTarget);
  };

  const [anchorElMenuSetSeatTypeForRow, setAnchorElMenuSetSeatTypeForRow] =
    useState(null);

  const handleCloseMenuSetSeatTypeForRow = () => {
    setAnchorElMenuSetSeatTypeForRow(null);
  };

  const [rowPreview, setRowPreview] = useState([]);
  const [columnPreview, setColumnPreview] = useState([]);

  useEffect(() => {
    let previewRowCount = -1;
    const tempRowPreview = [];

    const emptySeatPerColCount = [];
    let previewColumnCount = -1;

    seats.forEach(row => {
      let isHaveNonEmptySeat = false;

      row.forEach((item, index) => {
        emptySeatPerColCount[index] =
          (!!emptySeatPerColCount[index] ? emptySeatPerColCount[index] : 0) +
          (item === idEmptySeatType ? 0 : 1);

        isHaveNonEmptySeat = item !== idEmptySeatType || isHaveNonEmptySeat;
      });

      tempRowPreview.push(isHaveNonEmptySeat ? ++previewRowCount : -1);
    });

    setColumnPreview(
      emptySeatPerColCount.map(item =>
        item === 0 ? -1 : ++previewColumnCount,
      ),
    );

    setRowPreview(tempRowPreview);
  }, [seats]);

  return (
    <>
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          // justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Phòng chiếu
          </Typography>
          {/* <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Button
              variant="contained"
              mr={1}
              onClick={handleOpenAddEditRoom}
              color="secondary"
            >
              Thêm Phim
            </Button>
          </Stack> */}
        </Stack>
        {/* <RoomList rows={rows} setRows={setRows} headCells={headCells} /> */}

        <Box
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            width: '100%',
            flexWrap: 'wrap',
          }}
        >
          {/* <Paper elevation={3} sx={{ mb: 2 }}>
            <WeekendOutlinedIcon fontSize="large" sx={{ m: 1 }} />
          </Paper> */}
          <Typography sx={{ m: 1, height: '35px', width: '35px' }} />
          <Box
            sx={{
              backgroundColor: 'primary.main',
              width: `${!!seats[0] ? seats[0].length * 51 : 0}px`,
              height: '5px',
            }}
          />

          {seats.map((row, rowIndex) => {
            return (
              <Box
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  width: '100%',
                }}
              >
                {/* Row head button: A,B,C,...,AA,AB,...,# */}
                <Button
                  onClick={e => {
                    setSelectedRow(rowIndex);
                    handleClickRowOrColumn(e);
                  }}
                  sx={{ p: 0, minWidth: 0 }}
                >
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{ p: 0, m: 1, height: '35px', width: '35px' }}
                  >
                    {rowPreview[rowIndex] === -1
                      ? '#'
                      : numToAlphabet(rowPreview[rowIndex] + 1)}
                  </Typography>
                </Button>

                {/* List seats */}
                {row.map((item, index) => (
                  <Seat
                    onClick={handleClickRowOrColumn}
                    row={rowIndex}
                    column={index}
                    rowPreview={rowPreview[rowIndex]}
                    columnPreview={columnPreview[index]}
                    type={seatType[item]}
                    setSeats={setSeats}
                    sx={{
                      p: 0,
                      m: 1,
                      ml:
                        (index + 1) % 2 === 0
                          ? seatType[item].size === 2
                            ? 0
                            : 1
                          : seatType[item].size === 2
                          ? 2
                          : 1,
                      mr:
                        (index + 1) % 2 !== 0
                          ? seatType[item].size === 2
                            ? 0
                            : 1
                          : seatType[item].size === 2
                          ? 2
                          : 1,
                      color: seatType[item].color,
                    }}
                  />
                ))}
              </Box>
            );
          })}
          <Typography sx={{ m: 1, height: '35px', width: '35px' }} />
          {columnPreview &&
            columnPreview.map((x, index) => (
              <Button
                onClick={e => {
                  handleClickRowOrColumn(e);
                  setSelectedColumn(index);
                }}
                sx={{ p: 0, minWidth: 0 }}
              >
                <Typography
                  variant="h4"
                  align="center"
                  sx={{ p: 0, m: 1, height: '35px', width: '35px' }}
                >
                  {x === -1 ? '#' : x + 1}
                </Typography>
              </Button>
            ))}
        </Box>
      </Box>

      {/* Menu add, remove row or column */}
      <MenuWithArrow
        anchorEl={anchorElMenuEditRowCol}
        handleClose={handleCloseMenuEditRowCol}
      >
        {selectedRow !== -1 && (
          <MenuItem onClick={handleAddRowAbove}>
            <ListItemIcon>
              <ArrowUpwardRoundedIcon fontSize="small" />
            </ListItemIcon>
            Chèn hàng trên
          </MenuItem>
        )}

        {selectedRow !== -1 && (
          <MenuItem onClick={handleAddRowBelow}>
            <ListItemIcon>
              <ArrowDownwardRoundedIcon fontSize="small" />
            </ListItemIcon>
            Chèn hàng dưới
          </MenuItem>
        )}

        {selectedRow !== -1 && seats.length !== 1 && (
          <MenuItem onClick={handleDeleteRow}>
            <ListItemIcon>
              <ClearRoundedIcon fontSize="small" />
            </ListItemIcon>
            Xóa hàng
          </MenuItem>
        )}

        {selectedRow !== -1 && <Divider />}
        {selectedRow !== -1 && (
          <MenuItem
            onClick={e => {
              setSelectedRowForSetSeatType(selectedRow);
              setAnchorElMenuSetSeatTypeForRow(anchorElMenuEditRowCol);
            }}
          >
            <ListItemIcon>
              <WeekendOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Đặt loại ghế
          </MenuItem>
        )}

        {selectedColumn !== -1 && (
          <MenuItem>
            <ListItemIcon>
              <ArrowBackRoundedIcon fontSize="small" />
            </ListItemIcon>
            Chèn cột trước
          </MenuItem>
        )}

        {selectedColumn !== -1 && (
          <MenuItem>
            <ListItemIcon>
              <ArrowForwardRoundedIcon fontSize="small" />
            </ListItemIcon>
            Chèn cột sau
          </MenuItem>
        )}
        {selectedColumn !== -1 && (
          <MenuItem>
            <ListItemIcon>
              <ClearRoundedIcon fontSize="small" />
            </ListItemIcon>
            Xóa cột
          </MenuItem>
        )}
      </MenuWithArrow>

      {/* Menu set seatType for row */}
      <MenuWithArrow
        anchorEl={anchorElMenuSetSeatTypeForRow}
        handleClose={handleCloseMenuSetSeatTypeForRow}
      >
        <Typography variant="subtitle1" ml={1}>
          Chọn loại ghế
        </Typography>
        <Divider />
        {Object.keys(seatType).map(key => (
          <MenuItem
            onClick={() => {
              handleSetSeatTypeForRow(key);
            }}
          >
            <ListItemIcon>
              <WeekendOutlinedIcon
                sx={{ color: seatType[key].color }}
                fontSize="small"
              />
            </ListItemIcon>
            {seatType[key].typeName === '#' ? 'Trống' : seatType[key].typeName}
          </MenuItem>
        ))}
      </MenuWithArrow>
    </>
  );
}

const Seat = props => {
  const { rowPreview, columnPreview, type, setSeats, ...other } = props;

  const alphabetRow = numToAlphabet(rowPreview + 1);
  const toolTipTitle =
    `${type.typeName === '#' ? 'Trống' : type.typeName}` +
    (type.typeName !== '#'
      ? `: ${
          type.size === 1
            ? `${alphabetRow}-${columnPreview + 1}`
            : (columnPreview + 1) % 2 === 0
            ? `${alphabetRow}-${columnPreview}, ${alphabetRow}-${
                columnPreview + 1
              }`
            : `${alphabetRow}-${columnPreview + 1}, ${alphabetRow}-${
                columnPreview + 2
              }`
        }`
      : '');

  return (
    <Tooltip title={toolTipTitle} placement="top-start">
      {type.typeName !== '#' ? (
        <IconButton aria-label="add to shopping cart" {...other}>
          <WeekendOutlinedIcon fontSize="large" />
        </IconButton>
      ) : (
        <IconButton aria-label="add to shopping cart" {...other}>
          <AddRoundedIcon fontSize="large" />
        </IconButton>
      )}
    </Tooltip>
  );
};
