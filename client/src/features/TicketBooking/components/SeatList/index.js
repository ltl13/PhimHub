import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import numToAlphabet from 'utils/numToAlphabet';
import WeekendRoundedIcon from '@mui/icons-material/WeekendRounded';

function SeatList(props) {
  const [seats, setSeats] = useState([]);
  const [seatType, setSeatType] = useState({});
  const [selectedRow, setSelectedRow] = useState(-1);
  const [selectedColumn, setSelectedColumn] = useState(-1);
  const [idEmptySeatType, setIdEmptySeatType] = useState('');
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [selectedSeatType, setSelectedSeatType] = useState('');

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
        setSeats([[idEmptySeatType]]);
      }
    };
    load();
  }, [props.seatType]);

  useEffect(() => {
    if (props.onChange) props.onChange([...selectedSeat]);
  }, [selectedSeat]);

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

  const handleChooseSeat = () => {
    if (selectedRow === -1 || selectedColumn === -1) return;
    if (seatType[seats[selectedRow][selectedColumn]]?.size === 2) {
      const col1 = columnPreview[selectedColumn];
      const col2 =
        columnPreview[
          (selectedColumn + 1) % 2 === 0
            ? selectedColumn - 1
            : selectedColumn + 1
        ];
      const row = columnPreview[selectedRow];

      setSelectedSeat(prev => {
        const checker = prev.find(item => {
          return item.col1 === col1 && item.row === row;
        });

        if (!!checker) {
          return prev.filter(
            item => item.col !== col1 || item.col !== col2 || item.row !== row,
          );
        }

        return [
          ...prev,
          {
            row: row,
            col: col1,
          },
          {
            row: row,
            col: col2,
          },
        ];
      });
    } else {
      const col = columnPreview[selectedColumn];
      const row = columnPreview[selectedRow];

      setSelectedSeat(prev => {
        const checker = prev.find(item => {
          return item.col === col && item.row === row;
        });

        if (!!checker) {
          return prev.filter(item => item.col !== col || item.row !== row);
        }

        return [
          ...prev,
          {
            row: row,
            col: col,
          },
        ];
      });
    }
  };

  useEffect(() => {
    handleChooseSeat();
    console.log(selectedSeat);
  }, [selectedRow, selectedColumn]);

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

                  <Typography
                    variant="h4"
                    align="center"
                    sx={{ p: 0, m: 1, height: '35px', width: '35px' }}
                  >
                    {rowPreview[rowIndex] === -1
                      ? ''
                      : numToAlphabet(rowPreview[rowIndex] + 1)}
                  </Typography>

                  {/* List seats */}
                  {row.map((item, index) => (
                    <Seat
                      onClick={e => {
                        setSelectedRow(rowIndex);
                        setSelectedColumn(index);
                        // handleChooseSeat();
                      }}
                      row={rowIndex}
                      column={index}
                      rowPreview={rowPreview[rowIndex]}
                      columnPreview={columnPreview[index]}
                      type={seatType[item]}
                      setSeats={setSeats}
                      selectedSeat={selectedSeat}
                      selectedSeatType={selectedSeatType}
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
                columnPreview.map((x, index) => (
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{ p: 0, m: 1, height: '35px', width: '35px' }}
                  >
                    {x === -1 ? '' : x + 1}
                  </Typography>
                ))}
            </Box>
          </Box>
        </Box>
      </>
    )
  );
}

const Seat = props => {
  const {
    preview,
    rowPreview,
    selectedSeat,
    columnPreview,
    type,
    setSeats,
    ...other
  } = props;

  const alphabetRow = numToAlphabet(rowPreview + 1);
  const toolTipTitle =
    `${type.typeName === '#' ? '' : type.typeName}` +
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
      <Tooltip title={toolTipTitle} placement="top-start">
        {type.typeName !== '#' ? (
          <IconButton aria-label="add to shopping cart" {...other}>
            {!!selectedSeat?.find(
              item => item.col === columnPreview && item.row === rowPreview,
            ) ? (
              <WeekendRoundedIcon fontSize="large" />
            ) : (
              <WeekendOutlinedIcon fontSize="large" />
            )}
          </IconButton>
        ) : (
          <Typography sx={{ p: 0, m: 1, height: '35px', width: '35px' }} />
        )}
      </Tooltip>
    </>
  );
};

export default SeatList;
