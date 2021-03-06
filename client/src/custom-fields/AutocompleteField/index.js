import { TextField, Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';

AutocompleteField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disable: PropTypes.bool,
};

AutocompleteField.defaultProps = {
  label: '',
  disable: false,
};

function AutocompleteField(props) {
  const { form, name, label, disable, options, multiple } = props;
  const {
    formState: { errors },
  } = form;
  const hasError = errors[name];

  return (
    <>
      <Controller
        control={form.control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            onChange={(event, item) => {
              onChange(item);
            }}
            multiple={multiple}
            disableCloseOnSelect={multiple}
            filterSelectedOptions={!multiple}
            value={value}
            options={options}
            getOptionLabel={item => (!!item.label ? item.label : '')}
            isOptionEqualToValue={(option, value) =>
              value === undefined || value === '' || option.id === value.id
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                {multiple && (
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                )}
                {option.label}
              </li>
            )}
            renderInput={params => (
              <TextField
                {...params}
                label={label}
                variant="outlined"
                error={!!hasError}
                helperText={errors[name]?.message}
              />
            )}
          />
        )}
      />
    </>
  );
}

export default AutocompleteField;
