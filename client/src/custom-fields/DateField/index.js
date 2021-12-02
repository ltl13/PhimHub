import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

function DateField(props) {
  const { form, name, label, disable } = props;

  const {
    formState: { errors },
  } = form;
  const hasError = errors[name];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <DatePicker
            label={label}
            inputFormat="dd/MM/yyyy"
            onChange={date => field.onChange(date)}
            value={field.value}
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                error={!!hasError}
                helperText={errors[name]?.message}
                disabled={disable}
              />
            )}
          />
        )}
      />
    </LocalizationProvider>
  );
}

export default DateField;
