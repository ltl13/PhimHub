import { TextField } from '@mui/material';
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
  const { form, name, label, disable } = props;
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
            variant="outlined"
            margin="normal"
            label={label}
            fullWidth
            disable={disable}
            error={!!hasError}
            helperText={errors[name]?.message}
          ></TextField>
        )}
      />
    </>
  );
}

export default InputField;
