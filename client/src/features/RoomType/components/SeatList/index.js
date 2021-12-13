import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuWithArrow from 'components/Menu';
import React, { useEffect, useState } from 'react';
import numToAlphabet from 'utils/numToAlphabet';

function SeatList(props) {
  const [seats, setSeats] = useState([]);
  const [seatType, setSeatType] = useState({});
  const [selectedRow, setSelectedRow] = useState(-1);
  const [selectedRowForSetSeatType, setSelectedRowForSetSeatType] =
    useState(-1);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [idEmptySeatType, setIdEmptySeatType] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!!props.seatType) {
        const newSeatType = {};
        props.seatType.forEach(type => {
          newSeatType[type._id] = type;
          if (type.typeName === '#') setIdEmptySeatType(type._id);
        });
        setSeatType(newSeatType);
      }
      if (!!props.seats && !!props.seats[0] && !!props.seats[0][0]) {
        setSeats([...props.seats]);
      } else {
        setSeats([['61b1c0d8e15673926a17b3ef']]);
      }
    };
    load();
  }, [props.seats]);

  useEffect(() => {
    if (props.onChange) props.onChange([...seats]);
  }, [seats]);

  const handleDeleteRow = () => {
    if (seats.length > 1) {
      setSeats(prev => {
        const temp = [...prev];
        temp.splice(selectedRow, 1);
        return [...temp];
      });
    }
  };

  const handleAddRowAbove = () => {
    setSeats(prev => {
      const newRow = [];
      for (let i = 0; i < seats[0].length; i++) newRow.push(idEmptySeatType);

      const temp = [...prev];
      temp.splice(selectedRow, 0, newRow);
      return [...temp];
    });
  };

  const handleAddRowBelow = () => {
    setSeats(prev => {
      const newRow = [];
      for (let i = 0; i < seats[0].length; i++) newRow.push(idEmptySeatType);

      if (selectedRow === prev.length - 1) return prev.concat([newRow]);

      const temp = [...prev];
      temp.splice(selectedRow + 1, 0, newRow);
      return [...temp];
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

      const temp = [...prev];
      temp.splice(selectedRowForSetSeatType, 1, newRow);
      return [...temp];
    });
  };

  const checkColumnHasSize2Type = column => {
    let checker = false;

    seats.forEach(row => {
      checker = checker || seatType[row[column]].size === 2;
    });

    return checker;
  };

  const handleDeleteColumn = () => {
    if (!checkColumnHasSize2Type(selectedColumn)) {
      let isExistColHasSize2SeatAfterSelCol = false;
      let i =
        (selectedColumn + 1) % 2 === 0
          ? selectedColumn + 1
          : selectedColumn + 2;
      if (i < seats[0].length)
        for (; i < seats[0].length; i++) {
          isExistColHasSize2SeatAfterSelCol =
            isExistColHasSize2SeatAfterSelCol || checkColumnHasSize2Type(i);
        }

      setSeats(prev => {
        const temp = [...prev];
        return temp.map(row => {
          const temp = [...row];

          if (!isExistColHasSize2SeatAfterSelCol) {
            temp.splice(selectedColumn, 1);
          } else {
            temp.splice(
              selectedColumn % 2 === 0 ? selectedColumn : selectedColumn - 1,
              2,
            );
          }
          return temp;
        });
      });
    } else {
      const rowLength = seats[0].length;

      if (
        selectedColumn === rowLength - 1 ||
        (selectedColumn === rowLength - 2 &&
          checkColumnHasSize2Type(selectedColumn + 1))
      ) {
        setSeats(prev => {
          const temp = [...prev];

          return temp.map(row => {
            const temp = [...row];

            temp.splice(selectedColumn, 1);

            if (seatType[temp[temp.length - 1]].size === 2)
              temp[temp.length - 1] = idEmptySeatType;

            return temp;
          });
        });
      } else {
        setSeats(prev => {
          const temp = [...prev];
          return temp.map(row => {
            const temp = [...row];

            const indexDelete =
              selectedColumn % 2 === 0 ? selectedColumn : selectedColumn - 1;
            temp.splice(indexDelete, 2);

            return temp;
          });
        });
      }
    }
  };

  const handleAddColumnForward = () => {
    if (!checkColumnHasSize2Type(selectedColumn)) {
      let isExistColHasSize2SeatAfterSelCol = false;
      let i =
        (selectedColumn + 1) % 2 === 0
          ? selectedColumn + 1
          : selectedColumn + 2;
      if (i < seats[0].length)
        for (; i < seats[0].length; i++) {
          isExistColHasSize2SeatAfterSelCol =
            isExistColHasSize2SeatAfterSelCol || checkColumnHasSize2Type(i);
        }

      setSeats(prev => {
        const temp = [...prev];

        return temp.map(row => {
          const temp = [...row];

          if (!isExistColHasSize2SeatAfterSelCol) {
            temp.splice(selectedColumn, 0, idEmptySeatType);
          } else {
            temp.splice(
              selectedColumn % 2 === 0 ? selectedColumn : selectedColumn - 1,
              0,
              idEmptySeatType,
              idEmptySeatType,
            );
          }
          return temp;
        });
      });
    } else {
      setSeats(prev => {
        return prev.map(row => {
          const temp = [...row];

          const indexDelete =
            selectedColumn % 2 === 0 ? selectedColumn : selectedColumn - 1;
          temp.splice(indexDelete, 0, idEmptySeatType, idEmptySeatType);
          return temp;
        });
      });
    }
  };

  const handleAddColumnBack = () => {
    let isExistColHasSize2SeatAfterSelCol = false;
    let i =
      (selectedColumn + 1) % 2 === 0 ? selectedColumn + 1 : selectedColumn + 2;
    if (i < seats[0].length)
      for (; i < seats[0].length; i++) {
        isExistColHasSize2SeatAfterSelCol =
          isExistColHasSize2SeatAfterSelCol || checkColumnHasSize2Type(i);
      }

    if (!checkColumnHasSize2Type(selectedColumn)) {
      setSeats(prev => {
        return prev.map(row => {
          const temp = [...row];

          if (isExistColHasSize2SeatAfterSelCol) {
            temp.splice(
              (selectedColumn + 1) % 2 === 0
                ? selectedColumn + 1
                : selectedColumn + 2,
              0,
              idEmptySeatType,
              idEmptySeatType,
            );
          } else if (selectedColumn === seats[0].length - 1) {
            return temp.concat(idEmptySeatType);
          } else {
            temp.splice(selectedColumn + 1, 0, idEmptySeatType);
          }
          return temp;
        });
      });
    } else {
      setSeats(prev => {
        return prev.map(row => {
          const temp = [...row];

          const rowTail = temp.splice(
            (selectedColumn + 1) % 2 === 0
              ? selectedColumn + 1
              : selectedColumn + 2,
          );

          if (rowTail.length === 0) return temp.concat(idEmptySeatType);

          if (!isExistColHasSize2SeatAfterSelCol) {
            return temp.concat(idEmptySeatType, rowTail);
          } else {
            return temp.concat(idEmptySeatType, idEmptySeatType, rowTail);
          }
        });
      });
    }
  };

  const handleSetSeatType = key => {
    if (key === idEmptySeatType) {
      if (seatType[seats[selectedRow][selectedColumn]].size === 2) {
        setSeats(prev => {
          const temp = [...prev];
          temp[selectedRow].splice(
            (selectedColumn + 1) % 2 === 0
              ? selectedColumn - 1
              : selectedColumn,
            2,
            key,
            key,
          );

          return [...temp];
        });
      } else {
        setSeats(prev => {
          const temp = [...prev];
          temp[selectedRow].splice(selectedColumn, 1, key);

          return [...temp];
        });
      }
    } else if (seatType[key].size === 2) {
      if (
        (selectedColumn + 1) % 2 === 1 &&
        selectedColumn === seats[0].length - 1
      ) {
        handleAddColumnBack();
      }
      setSeats(prev => {
        const temp = [...prev];
        temp[selectedRow].splice(
          (selectedColumn + 1) % 2 === 0 ? selectedColumn - 1 : selectedColumn,
          2,
          key,
          key,
        );
        return [...temp];
      });
    } else {
      setSeats(prev => {
        const temp = [...prev];
        temp[selectedRow].splice(selectedColumn, 1, key);

        return [...temp];
      });
    }
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

  const [anchorElMenuSetSeatType, setAnchorElMenuSetSeatType] = useState(null);

  const handleCloseMenuSetSeatType = () => {
    setAnchorElMenuSetSeatType(null);
    setSelectedRow(-1);
    setSelectedColumn(-1);
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
    seats.length > 0 && (
      <>
        <Box>
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
            <Stack align="center">
              <Typography variant="h5">Màn Chiếu</Typography>
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  width: `${!!seats[0] ? seats[0].length * 51 : 0}px`,
                  height: '5px',
                }}
              />
            </Stack>

            {seats.map((row, rowIndex) => {
              return (
                <Box
                  key={rowIndex}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    width: '100%',
                  }}
                >
                  {/* Row head button: A,B,C,...,AA,AB,...,# */}
                  {!props.preview ? (
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
                  ) : (
                    <Typography
                      variant="h4"
                      align="center"
                      sx={{ p: 0, m: 1, height: '35px', width: '35px' }}
                    >
                      {rowPreview[rowIndex] === -1
                        ? ''
                        : numToAlphabet(rowPreview[rowIndex] + 1)}
                    </Typography>
                  )}

                  {/* List seats */}
                  {row.map((item, index) => (
                    <Seat
                      key={index}
                      onClick={e => {
                        setAnchorElMenuSetSeatType(e.currentTarget);
                        setSelectedRow(rowIndex);
                        setSelectedColumn(index);
                      }}
                      preview={props.preview}
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
            <Box
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                width: '100%',
              }}
            >
              <Typography sx={{ m: 1, height: '35px', width: '35px' }} />
              {columnPreview &&
                columnPreview.map((x, index) =>
                  !props.preview ? (
                    <Button
                      key={index}
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
                  ) : (
                    <Typography
                      variant="h4"
                      align="center"
                      sx={{ p: 0, m: 1, height: '35px', width: '35px' }}
                    >
                      {x === -1 ? '' : x + 1}
                    </Typography>
                  ),
                )}
            </Box>
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
            <MenuItem onClick={handleAddColumnForward}>
              <ListItemIcon>
                <ArrowBackRoundedIcon fontSize="small" />
              </ListItemIcon>
              Chèn cột trước
            </MenuItem>
          )}

          {selectedColumn !== -1 && (
            <MenuItem onClick={handleAddColumnBack}>
              <ListItemIcon>
                <ArrowForwardRoundedIcon fontSize="small" />
              </ListItemIcon>
              Chèn cột sau
            </MenuItem>
          )}
          {selectedColumn !== -1 && seats[0].length !== 1 && (
            <MenuItem onClick={handleDeleteColumn}>
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
          {Object.keys(seatType).map((key, index) => (
            <MenuItem
              key={index}
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
              {seatType[key].typeName === '#'
                ? 'Trống'
                : seatType[key].typeName}
            </MenuItem>
          ))}
        </MenuWithArrow>

        <MenuWithArrow
          anchorEl={anchorElMenuSetSeatType}
          handleClose={handleCloseMenuSetSeatType}
        >
          <Typography variant="subtitle1" ml={1} mr={1}>
            Chọn loại ghế
          </Typography>
          <Divider />
          {Object.keys(seatType).map(key => {
            if (selectedColumn === -1 || selectedRow === -1) return undefined;
            if (key !== idEmptySeatType) {
              if (
                seats[selectedRow].some(
                  item =>
                    seatType[key].size !== seatType[item].size &&
                    item !== idEmptySeatType,
                )
              )
                return undefined;
            }
            return (
              <MenuItem
                key={key}
                onClick={() => {
                  handleSetSeatType(key);
                }}
              >
                <ListItemIcon>
                  <WeekendOutlinedIcon
                    sx={{ color: seatType[key].color }}
                    fontSize="small"
                  />
                </ListItemIcon>
                {seatType[key].typeName === '#'
                  ? 'Trống'
                  : seatType[key].typeName}
              </MenuItem>
            );
          })}
        </MenuWithArrow>
      </>
    )
  );
}

const Seat = props => {
  const { preview, rowPreview, columnPreview, type, setSeats, ...other } =
    props;

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
    <>
      {!preview ? (
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
      ) : (
        <Tooltip title={toolTipTitle} placement="top-start">
          {type.typeName !== '#' ? (
            <WeekendOutlinedIcon fontSize="large" sx={other.sx} />
          ) : (
            <Typography sx={{ p: 0, m: 1, height: '35px', width: '35px' }} />
          )}
        </Tooltip>
      )}
    </>
  );
};

export default SeatList;
