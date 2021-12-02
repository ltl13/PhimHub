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
  createStaff,
  getStaffById,
  updateStaffById,
} from 'features/Staff/slice';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import upload from 'utils/Firebase/upload';
import * as yup from 'yup';

const getErrorMessage = type => {
  switch (type) {
    case 'phoneNumber':
      return 'Số điện thoại đã được sử dụng';
    case 'identityNumber':
      return 'CMND/CCCD đã tồn tại';
    case 'email':
      return 'Email đã được sử dụng';
    case 'username':
      return 'Tên đăng nhập đã tồn tại';
    default:
      return 'Lỗi server';
  }
};

const emptyInitialValue = {
  name: '',
  identityNumber: '',
  sex: null,
  dateOfBirth: new Date(),
  phoneNumber: '',
  email: '',
  staffType: null,
  salary: 0,
  username: '',
  password: '',
  avatar: null,
};

function AddEditStaff(props) {
  const { onClose, open, setRows, staffId } = props;
  const dispatch = useDispatch();
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const staffTypes = useSelector(state => state.staffType.current);
  const [avatarUrl, setAvatarUrl] = useState('');

  const listStaffType = staffTypes?.map(item => ({
    id: item._id,
    label: item.typeName,
  }));

  const schema = yup.object().shape({
    name: yup
      .string()
      .matches(
        /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]*$/,
        'Tên chỉ chứa chữ',
      )
      .required('Tên nhân viên không được để trống'),
    identityNumber: yup
      .string()
      .matches(/^[0-9]{9,12}$/, 'CMND/CCCD là chuỗi chứa 9-12 chữ số')
      .required('CMND/CCCD không được để trống'),
    sex: yup.object().required('Giới tính không được để trống').nullable(),
    dateOfBirth: yup
      .date()
      .nullable()
      .required('Ngày sinh không được để trống')
      .max(
        new Date(Date.now() - 86400000 * 365 * 18),
        'Nhân viên phải trên 18 tuổi',
      ),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Số điện thoại là chuỗi chứa 10 chữ số')
      .required('Số điện thoại không được để trống'),
    email: yup
      .string()
      .required('Email không được để trống')
      .email('Email không hợp lệ'),
    staffType: yup.object().required('Chức vụ không được để trống').nullable(),
    salary: yup
      .number()
      .transform((value, originalValue) =>
        /\s/.test(originalValue) ? NaN : value,
      )
      .typeError('Lương phải là số nguyên')
      .required('Lương không được để trống'),
    username: yup.string().required('Tên đăng nhập không được để trống'),
    // password: yup.string().required('Mật khẩu không được để trống'),
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
      if (!!staffId) {
        const response = await dispatch(getStaffById({ id: staffId }));
        reset({
          name: response.payload.staff.name,
          identityNumber: response.payload.staff.identityNumber,
          sex: response.payload.staff.sex
            ? { id: 1, label: 'Nam' }
            : { id: 0, label: 'Nữ' },
          dateOfBirth: response.payload.staff.dateOfBirth,
          phoneNumber: response.payload.staff.phoneNumber,
          email: response.payload.staff.email,
          staffType: {
            id: response.payload.staff.staffType._id,
            label: response.payload.staff.staffType.typeName,
          },
          salary: response.payload.staff.salary,
          username: response.payload.staff.username,
          password: '',
          avatar: null,
        });
        setAvatarUrl(response.payload.staff.avatar);
      }
    }

    load();
  }, [open]);

  const handleSubmit = async data => {
    if (!data.password && !staffId) {
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
      staffType: data.staffType.id,
      dateOfBirth: data.dateOfBirth,
      avatar: !!data.avatar ? url[data.avatar.name] : '',
    };

    if (!staffId) {
      const actions = createStaff(reqBody);
      const response = await dispatch(actions);

      if (response.payload.success) {
        setIsSubmitSuccess(true);

        setRows(prev => {
          const tempRow = {};
          tempRow.id = response.payload.newStaff._id;
          tempRow.staffName = response.payload.newStaff.name;
          tempRow.avatarUrl = response.payload.newStaff.avatar;
          tempRow.role = staffTypes.find(
            item => item._id === response.payload.newStaff.staffType,
          ).typeName;
          tempRow.identityNumber = response.payload.newStaff.identityNumber;
          tempRow.phoneNum = response.payload.newStaff.phoneNumber;

          return [...prev, tempRow];
        });
      } else {
        setError('createStaff', {
          type: 'manual',
          message:
            !!response.payload.invalid &&
            getErrorMessage(response.payload.invalid),
        });
      }
    } else {
      const response = await dispatch(
        updateStaffById({ id: staffId, data: reqBody }),
      );
      if (response.payload.success) {
        setIsSubmitSuccess(true);

        setRows(prev => {
          const newRows = prev.filter(item => item.id !== staffId);

          const tempRow = {};
          tempRow.id = staffId;
          tempRow.staffName = reqBody.name;
          tempRow.avatarUrl = !!reqBody.avatar ? reqBody.avatar : avatarUrl;
          tempRow.role = staffTypes.find(
            item => item._id === reqBody.staffType,
          ).typeName;
          tempRow.identityNumber = reqBody.identityNumber;
          tempRow.phoneNum = reqBody.phoneNumber;

          return [...newRows, tempRow];
        });
      } else {
        setError('createStaff', {
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
              <Grid item xs={12} mb={3} align="center">
                <AvatarField
                  name="avatar"
                  form={form}
                  defaultValue={avatarUrl}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Tài khoản</Typography>
              </Grid>
              <Grid item xs={12}>
                <InputField name="username" label="Tên đăng nhập" form={form} />
              </Grid>
              <Grid item xs={12}>
                <PasswordField name="password" label="Mật khẩu" form={form} />
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
                  <Typography variant="h4">Thông tin nhân viên</Typography>
                  <IconButton onClick={handleClose}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <InputField name="name" label="Tên" form={form} />
              </Grid>

              <Grid item xs={6}>
                <InputField
                  name="identityNumber"
                  label="CMND/CCCD"
                  form={form}
                />
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
                <AutocompleteField
                  name="staffType"
                  label="Chức vụ"
                  form={form}
                  options={listStaffType}
                />
              </Grid>

              <Grid item xs={6}>
                <InputField name="salary" label="Lương" form={form} />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItem: 'center',
                  }}
                >
                  {!errors.createStaff && !isSubmitSuccess && (
                    <Box width="1px" height="1px" />
                  )}
                  {!!errors.createStaff && (
                    <FormHelperText error={errors.createStaff}>
                      {errors.createStaff.message}
                    </FormHelperText>
                  )}
                  {!!isSubmitSuccess && (
                    <FormHelperText sx={{ color: 'text.success' }}>
                      {!!staffId ? 'Sửa thành công' : 'Thêm thành công'}
                    </FormHelperText>
                  )}
                  {!!staffId ? (
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
                      Thêm nhân viên
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

export default AddEditStaff;
