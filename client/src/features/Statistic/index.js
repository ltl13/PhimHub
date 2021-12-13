import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  TextField,
  Autocomplete,
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function Customer() {
  const [statisticOption, setStatisticOption] = useState(statisticOptions[0]);
  const [date, setDate] = useState(new Date());

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
              onChange={(_, value) => setStatisticOption(value)}
              renderInput={params => (
                <TextField {...params} label="Loại thống kê" />
              )}
            />
            {statisticOption === statisticOptions[0] ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Basic example"
                  value={date}
                  onChange={newValue => {
                    setDate(newValue);
                  }}
                  renderInput={params => <TextField {...params} />}
                />
              </LocalizationProvider>
            ) : (
              <Typography variant="h4">{statisticOptions[1]}</Typography>
            )}
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

const statisticOptions = ['Trong ngày', 'Trong tháng', 'Trong năm', 'Các năm'];
