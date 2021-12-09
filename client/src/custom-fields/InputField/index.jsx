import { InputAdornment, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

InputField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disable: PropTypes.bool,
};

InputField.defaultProps = {
  label: '',
  disable: false,
};

function InputField(props) {
  const { form, name, label, disable, multiline, unit } = props;
  const {
    formState: { errors },
  } = form;
  const hasError = errors[name];

  return (
    <>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <TextField
            {...field}
            multiline={!!multiline}
            rows={!!multiline ? 2 : undefined}
            variant="outlined"
            label={label}
            fullWidth
            disabled={disable}
            error={!!hasError}
            helperText={errors[name]?.message}
            InputProps={
              !!unit
                ? {
                    endAdornment: (
                      <InputAdornment position="end">{unit}</InputAdornment>
                    ),
                  }
                : undefined
            }
          ></TextField>
        )}
      />
    </>
  );
}

export default InputField;
