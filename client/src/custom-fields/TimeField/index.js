import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { TimePicker } from '@mui/lab';

function TimeField(props) {
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
          <TimePicker
            label={label}
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

export default TimeField;
