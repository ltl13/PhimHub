import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

PasswordField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disable: PropTypes.bool,
};

PasswordField.defaultProps = {
  label: '',
  disable: false,
};

function PasswordField(props) {
  const { form, name, label, disable } = props;
  const {
    formState: { errors },
  } = form;
  const hasError = errors[name];
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!hasError}
            type={showPassword ? 'text' : 'password'}
            label={label}
            disable={disable}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={errors[name]?.message}
          ></TextField>
        )}
      />
    </>
  );
}

export default PasswordField;
