import { Avatar, Button, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

function AvatarField(props) {
  const { form, name, label, disable, ...other } = props;

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <label htmlFor="avatar-upload">
          <Button component="span" sx={{ padding: 0, borderRadius: '50%' }}>
            <Avatar
              src={field.value && URL.createObjectURL(field.value)}
              alt=""
              sx={{ width: 130, height: 130 }}
            />
            <Box
              sx={{
                backgroundColor: 'black',
                width: 130,
                height: 65,
                top: 65,
                borderBottomLeftRadius: 65,
                borderBottomRightRadius: 65,
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
          </Button>
          <input
            accept="image/*"
            id="avatar-upload"
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

export default AvatarField;
