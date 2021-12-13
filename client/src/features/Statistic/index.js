import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  TextField,
  Autocomplete,
} from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Chart, PieSeries } from '@devexpress/dx-react-chart-material-ui';
import {
  getStatisticByMonthInYear,
  getStatisticByMoviesInDate,
  getStatisticByMoviesInMonth,
  getStatisticByYears,
} from './slice';

export default function Statistic() {
  const dispatch = useDispatch();
  const [statisticOption, setStatisticOption] = useState(statisticOptions[0]);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(openBackdrop());

    const _loadData = async () => {
      const action = getStatisticByMoviesInDate({ date });
      const response = await dispatch(action);
      if (response.payload.success) {
        setData(response.payload.result);
      } else {
        setData([]);
      }
    };
    _loadData();

    dispatch(closeBackdrop());
  }, [date]);

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
            Thống kê
          </Typography>
        </Stack>
        <Paper sx={{ width: '100%', mb: 2, padding: '25px' }} elevation={3}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="start"
            mb={5}
          >
            <Autocomplete
              disablePortal
              defaultValue={statisticOption}
              id="cbb-statistic-type"
              options={statisticOptions}
              sx={{ width: 200 }}
              onChange={(_, value) => setStatisticOption(value)}
              renderInput={params => (
                <TextField {...params} label="Loại thống kê" />
              )}
            />
            {statisticOption === statisticOptions[0] ? (
              <>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Basic example"
                    value={date}
                    onChange={newValue => setDate(newValue)}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </>
            ) : (
              <Typography variant="h4">Alooo part 1</Typography>
            )}
          </Stack>
          {statisticOption === statisticOptions[0] ? (
            <Chart data={data}>
              <PieSeries valueField="income" argumentField="movie" />
            </Chart>
          ) : (
            <Typography variant="h4">Aloooo part 2</Typography>
          )}
        </Paper>
      </Box>
    </>
  );
}

const statisticOptions = ['Trong ngày', 'Trong tháng', 'Trong năm', 'Các năm'];
