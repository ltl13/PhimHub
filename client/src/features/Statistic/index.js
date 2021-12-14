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
            Thống kê
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
                <TextField {...params} label="Loại thống kê" />
              )}
            />
            {statisticOption === statisticOptions[0] ? (
              <>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Chọn ngày"
                    value={date}
                    onChange={value => setDate(value)}
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
                    <TextField {...params} label="Tháng" />
                  )}
                />
                <TextField
                  value={year}
                  label="Năm"
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
                  label="Năm"
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
                  label="Từ năm"
                  id="tf-from-year"
                  onChange={event => {
                    if (event.target.value != null) {
                      setFromYear(Number(event.target.value));
                    }
                  }}
                />
                <TextField
                  value={toYear}
                  label="Đến năm"
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
              Lấy báo cáo
            </Button>
          </Stack>
          {data.length === 0 ? (
            <Typography variant="h4" gutterBottom>
              {'Ôi bạn ơi, không tìm thấy dữ liệu :"<'}
            </Typography>
          ) : statisticOption === statisticOptions[0] ? (
            <Chart data={data}>
              <PieSeries valueField="income" argumentField="movie" />
              <Legend />
              <Title
                text={`Biểu đồ báo cáo doanh thu ngày ${date.getDate()} tháng ${
                  date.getMonth() + 1
                } năm ${date.getFullYear()}`}
              />
              <EventTracker />
              <Tooltip />
            </Chart>
          ) : statisticOption === statisticOptions[1] ? (
            <Chart data={data}>
              <PieSeries valueField="income" argumentField="movie" />
              <Legend />
              <Title
                text={`Biểu đồ báo cáo doanh thu tháng ${month} năm ${year}`}
              />
              <EventTracker />
              <Tooltip />
            </Chart>
          ) : statisticOption === statisticOptions[2] ? (
            <Chart data={data}>
              <LineSeries valueField="income" argumentField="month" />
              <ArgumentAxis />
              <ValueAxis />
              <Legend />
              <Title text={`Biểu đồ báo cáo doanh thu năm ${year}`} />
              <EventTracker />
              <Tooltip />
            </Chart>
          ) : (
            <Chart data={data}>
              <ArgumentAxis />
              <ValueAxis />
              <LineSeries
                valueField="income"
                argumentField="year"
                barWidth={200}
              />
              <Legend />
              <Title
                text={`Biểu đồ báo cáo doanh thu các năm từ ${fromYear} đến ${toYear}`}
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
  'Trong Ngày',
  'Trong Tháng',
  'Trong Năm',
  'Qua các năm',
];
const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
