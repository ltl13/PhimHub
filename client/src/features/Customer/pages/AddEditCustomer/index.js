import { yupResolver } from '@hookform/resolvers/yup';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Button,
  Dialog,
  FormHelperText,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { closeBackdrop, openBackdrop } from 'app/backdropSlice';
import AutocompleteField from 'custom-fields/AutocompleteField';
import AvatarField from 'custom-fields/AvatarField';
import DateField from 'custom-fields/DateField';
import InputField from 'custom-fields/InputField';
import PasswordField from 'custom-fields/PasswordField';
import {
  createCustomer,
  getCustomerById,
  updateCustomerById,
} from 'features/Customer/slice';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import upload from 'utils/Firebase/upload';
import * as yup from 'yup';

const getErrorMessage = type => {
  switch (type) {
    case 'phoneNumber':
      return 'Số điện thoại đã được sử dụng';
    case 'email':
      return 'Email đã được sử dụng';
    default:
      return 'Lỗi server';
  }
};

const emptyInitialValue = {
  name: '',
  sex: null,
  dateOfBirth: new Date(),
  phoneNumber: '',
  email: '',
  password: '',
  avatar: null,
};

function AddEditCustomer(props) {
  const { onClose, open, setRows, customerId } = props;
  const dispatch = useDispatch();
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const schema = yup.object().shape({
    name: yup
      .string()
      .matches(
        /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]*$/,
        'Tên chỉ chứa chữ',
      )
      .required('Tên nhân viên không được để trống'),
    sex: yup.object().required('Giới tính không được để trống').nullable(),
    dateOfBirth: yup
      .date()
      .nullable()
      .required('Ngày sinh không được để trống')
      .max(
        new Date(Date.now() - 86400000 * 365 * 16),
        'Khác hàng phải trên 16 tuổi',
      ),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Số điện thoại là chuỗi chứa 10 chữ số')
      .required('Số điện thoại không được để trống'),
    email: yup
      .string()
      .required('Email không được để trống')
      .email('Email không hợp lệ'),
  });

  const form = useForm({
    defaultValues: emptyInitialValue,
    resolver: yupResolver(schema),
  });

  const {
    setError,
    formState: { errors, isDirty },
    clearErrors,
    reset,
  } = form;

  const { isSubmitting } = form.formState;

  useEffect(() => {
    async function load() {
      if (!!customerId) {
        const response = await dispatch(getCustomerById({ id: customerId }));
        reset({
          name: response.payload.customer.name,
          sex: response.payload.customer.sex
            ? { id: 1, label: 'Nam' }
            : { id: 0, label: 'Nữ' },
          dateOfBirth: response.payload.customer.dateOfBirth,
          phoneNumber: response.payload.customer.phoneNumber,
          email: response.payload.customer.email,
          password: '',
          avatar: null,
        });
        setAvatarUrl(response.payload.customer.avatar);
      }
    }

    load();
  }, [open]);

  const handleSubmit = async data => {
    if (!data.password && !customerId) {
      setError('password', {
        type: 'manual',
        message: 'Mật khẩu không được để trống',
      });

      return;
    }

    setIsSubmitSuccess(false);
    dispatch(openBackdrop());
    clearErrors();

    let url;
    if (data.avatar) {
      url = await upload([data.avatar]);
    }

    const reqBody = {
      ...data,
      sex: data.sex.id,
      dateOfBirth: data.dateOfBirth,
      avatar: !!data.avatar ? url[data.avatar.name] : '',
    };

    if (!customerId) {
      const actions = createCustomer(reqBody);
      const response = await dispatch(actions);

      if (response.payload.success) {
        setIsSubmitSuccess(true);

        setRows(prev => {
          const tempRow = {};
          tempRow.id = response.payload.newCustomer._id;
          tempRow.name = response.payload.newCustomer.name;
          tempRow.avatarUrl = response.payload.newCustomer.avatar;
          tempRow.phoneNum = response.payload.newCustomer.phoneNumber;
          tempRow.email = reqBody.email;

          return [...prev, tempRow];
        });
      } else {
        setError('createCustomer', {
          type: 'manual',
          message:
            !!response.payload.invalid &&
            getErrorMessage(response.payload.invalid),
        });
      }
    } else {
      const response = await dispatch(
        updateCustomerById({ id: customerId, data: reqBody }),
      );
      if (response.payload.success) {
        setIsSubmitSuccess(true);

        setRows(prev => {
          const newRows = prev.filter(item => item.id !== customerId);

          const tempRow = {};
          tempRow.id = customerId;
          tempRow.name = reqBody.name;
          tempRow.avatarUrl = !!reqBody.avatar ? reqBody.avatar : avatarUrl;
          tempRow.phoneNum = reqBody.phoneNumber;
          tempRow.email = reqBody.email;

          return [...newRows, tempRow];
        });
      } else {
        setError('createCustomer', {
          type: 'manual',
          message:
            !!response.payload.invalid &&
            getErrorMessage(response.payload.invalid),
        });
      }
    }

    dispatch(closeBackdrop());
  };

  const handleClose = () => {
    onClose();
    reset(emptyInitialValue);
    clearErrors();
    setIsSubmitSuccess(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md">
      {isSubmitting && <LinearProgress color="primary" />}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack direction="row" alignItems="center" m={2} spacing={2}>
          <Paper sx={{ flexGrow: 2 }}>
            <Grid container spacing={2} p={3.5}>
              <Grid item xs={12} align="center">
                <AvatarField
                  name="avatar"
                  form={form}
                  defaultValue={avatarUrl}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} p={3.5}>
              <Grid xs={12} mb={2}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItem: 'center',
                  }}
                >
                  <Typography variant="h4">Thông tin khách hàng</Typography>
                  <IconButton onClick={handleClose}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <InputField name="name" label="Tên" form={form} />
              </Grid>

              <Grid item xs={6}>
                <AutocompleteField
                  name="sex"
                  label="Giới tính"
                  form={form}
                  options={[
                    { id: 0, label: 'Nữ' },
                    { id: 1, label: 'Nam' },
                  ]}
                />
              </Grid>

              <Grid item xs={6}>
                <DateField name="dateOfBirth" label="Ngày Sinh" form={form} />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="phoneNumber"
                  label="Số điện thoại"
                  form={form}
                />
              </Grid>

              <Grid item xs={6}>
                <InputField name="email" label="Email" form={form} />
              </Grid>

              <Grid item xs={6}>
                <PasswordField name="password" label="Mật khẩu" form={form} />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItem: 'center',
                  }}
                >
                  {!errors.createCustomer && !isSubmitSuccess && (
                    <Box width="1px" height="1px" />
                  )}
                  {!!errors.createCustomer && (
                    <FormHelperText error={errors.createCustomer}>
                      {errors.createCustomer.message}
                    </FormHelperText>
                  )}
                  {!!isSubmitSuccess && (
                    <FormHelperText sx={{ color: 'text.success' }}>
                      {!!customerId ? 'Sửa thành công' : 'Thêm thành công'}
                    </FormHelperText>
                  )}
                  {!!customerId ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!isDirty}
                    >
                      Lưu chỉnh sửa
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" type="submit">
                      Thêm khách hàng
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </form>
    </Dialog>
  );
}

export default AddEditCustomer;
