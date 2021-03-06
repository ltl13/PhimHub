import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  Autocomplete,
} from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import { scaleBand } from '@devexpress/dx-chart-core';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Chart,
  PieSeries,
  Tooltip,
  Legend,
  Title,
  BarSeries,
  LineSeries,
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
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
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [fromYear, setFromYear] = useState(new Date().getFullYear() - 1);
  const [toYear, setToYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    dispatch(openBackdrop());

    const _loadData = async () => {
      let action;
      switch (statisticOption) {
        case statisticOptions[0]:
          action = getStatisticByMoviesInDate({ date });
          break;
        case statisticOptions[1]:
          action = getStatisticByMoviesInMonth({ month: month - 1, year });
          break;
        case statisticOptions[2]:
          action = getStatisticByMonthInYear({ year });
          break;
        case statisticOptions[3]:
          action = getStatisticByYears({ fromYear, toYear });
          break;
        default:
          break;
      }
      const response = await dispatch(action);
      if (response.payload.success) {
        setData(response.payload.result);
      } else {
        setData([]);
      }
    };
    _loadData();

    dispatch(closeBackdrop());
  }, [submit]);

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
            Th???ng k??
          </Typography>
        </Stack>
        <Paper sx={{ width: '100%', mb: 2, padding: '25px' }} elevation={3}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Autocomplete
              disablePortal
              defaultValue={statisticOption}
              id="cbb-statistic-type"
              options={statisticOptions}
              sx={{ width: 200 }}
              onChange={(_, value) => {
                if (value != null) {
                  setStatisticOption(value);
                }
              }}
              renderInput={params => (
                <TextField {...params} label="Lo???i th???ng k??" />
              )}
            />
            {statisticOption === statisticOptions[0] ? (
              <>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ch???n ng??y"
                    value={date}
                    onChange={value => {
                      if (value != null) {
                        setDate(value);
                      }
                    }}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </>
            ) : statisticOption === statisticOptions[1] ? (
              <>
                <Autocomplete
                  disablePortal
                  defaultValue={month}
                  id="cbb-month"
                  options={months}
                  sx={{ width: 200 }}
                  onChange={(_, value) => {
                    if (value != null) {
                      setMonth(Number(value));
                    }
                  }}
                  renderInput={params => (
                    <TextField {...params} label="Th??ng" />
                  )}
                />
                <TextField
                  value={year}
                  label="N??m"
                  id="tf-year"
                  onChange={event => {
                    if (event.target.value != null) {
                      setYear(Number(event.target.value));
                    }
                  }}
                />
              </>
            ) : statisticOption === statisticOptions[2] ? (
              <>
                <TextField
                  value={year}
                  label="N??m"
                  id="tf-year"
                  onChange={event => {
                    if (event.target.value != null) {
                      setYear(Number(event.target.value));
                    }
                  }}
                />
              </>
            ) : (
              <>
                <TextField
                  value={fromYear}
                  label="T??? n??m"
                  id="tf-from-year"
                  onChange={event => {
                    if (event.target.value != null) {
                      setFromYear(Number(event.target.value));
                    }
                  }}
                />
                <TextField
                  value={toYear}
                  label="?????n n??m"
                  id="tf-to-year"
                  onChange={event => {
                    if (event.target.value != null) {
                      setToYear(Number(event.target.value));
                    }
                  }}
                />
              </>
            )}
            <Button
              variant="contained"
              mr={1}
              onClick={() => {
                setSubmit(!submit);
              }}
              color="secondary"
            >
              L???y b??o c??o
            </Button>
          </Stack>
          {data.length === 0 ? (
            <Typography variant="h4" gutterBottom>
              {'??i b???n ??i, kh??ng t??m th???y d??? li???u :"<'}
            </Typography>
          ) : statisticOption === statisticOptions[0] ? (
            <Chart data={data}>
              <PieSeries valueField="income" argumentField="movie" />
              <Legend />
              <Title
                text={`Bi???u ????? b??o c??o doanh thu ng??y ${date.getDate()} th??ng ${
                  date.getMonth() + 1
                } n??m ${date.getFullYear()}`}
              />
              <EventTracker />
              <Tooltip />
            </Chart>
          ) : statisticOption === statisticOptions[1] ? (
            <Chart data={data}>
              <PieSeries valueField="income" argumentField="movie" />
              <Legend />
              <Title
                text={`Bi???u ????? b??o c??o doanh thu th??ng ${month} n??m ${year}`}
              />
              <EventTracker />
              <Tooltip />
            </Chart>
          ) : statisticOption === statisticOptions[2] ? (
            <Chart data={data}>
              <LineSeries valueField="income" argumentField="month" />
              <ArgumentAxis />
              <ValueAxis />
              <Title text={`Bi???u ????? b??o c??o doanh thu n??m ${year}`} />
              <EventTracker />
              <Tooltip />
            </Chart>
          ) : (
            <Chart data={data}>
              <ArgumentAxis />
              <ValueAxis />
              <LineSeries valueField="income" argumentField="year" />
              <Title
                text={`Bi???u ????? b??o c??o doanh thu c??c n??m t??? ${fromYear} ?????n ${toYear}`}
              />
              <EventTracker />
              <Tooltip />
            </Chart>
          )}
        </Paper>
      </Box>
    </>
  );
}

const statisticOptions = [
  'Trong Ng??y',
  'Trong Th??ng',
  'Trong N??m',
  'Qua c??c n??m',
];
const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
