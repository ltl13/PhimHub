import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

function ImageField(props) {
  const { form, name, defaultValue, type, width, height, label } = props;

  const emptyImageUrl =
    'https://www.plazalibre.com/storage/app/uploads/public/596/fb1/03c/596fb103c4809935793467.png';

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <label htmlFor={name} style={{ width: width, height: height }}>
          <Button
            component="span"
            sx={
              type === 'avatar'
                ? { padding: 0, borderRadius: '50%' }
                : { padding: 0 }
            }
          >
            {type === 'avatar' && (
              <>
                <Avatar
                  src={
                    !!field.value
                      ? URL.createObjectURL(field.value)
                      : defaultValue
                  }
                  alt=""
                  sx={{ width: width, height: height }}
                />
                <Box
                  sx={{
                    backgroundColor: 'black',
                    width: width,
                    height: height / 2,
                    top: height / 2,
                    borderBottomLeftRadius: height / 2,
                    borderBottomRightRadius: height / 2,
                    position: 'absolute',
                    opacity: 0.4,
                  }}
                >
                  <Typography
                    variant="body1"
                    color="#fff"
                    sx={{ position: 'relative', top: 15 }}
                  >
                    Tải Ảnh Lên
                  </Typography>
                </Box>
              </>
            )}

            {type === 'image' && (
              <>
                <Paper variant="outlined" sx={{ padding: 0 }}>
                  <img
                    src={
                      !!field.value
                        ? URL.createObjectURL(field.value)
                        : !!defaultValue
                        ? defaultValue
                        : emptyImageUrl
                    }
                    alt=""
                    style={{ width: width, height: height, objectFit: 'cover' }}
                  />
                </Paper>
                <Box
                  sx={{
                    backgroundColor: 'black',
                    width: width,
                    top: height / 2.5,
                    bottom: height / 2.5,
                    position: 'absolute',
                    opacity: 0.4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body1" color="#fff">
                    {label}
                  </Typography>
                </Box>
              </>
            )}
          </Button>
          <input
            accept="image/*"
            id={name}
            type="file"
            onChange={event => {
              field.onChange(event.target.files[0]);
            }}
            style={{ display: 'none' }}
          />
        </label>
      )}
    />
  );
}

export default ImageField;
