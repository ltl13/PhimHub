import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import DateField from 'custom-fields/DateField';
import TimeField from 'custom-fields/TimeField';
import { useForm } from 'react-hook-form';
import 'react-horizontal-strip-datepicker/dist/ReactHorizontalDatePicker.css';
import ReactHorizontalDatePicker from 'react-horizontal-strip-datepicker';
import DatePicker from 'react-horizontal-datepicker';
import * as yup from 'yup';

function AddEditShowTime(props) {
  const schema = yup.object().shape({
    time: yup.date().required('Loại phòng không được để trống'),
    date: yup
      .date()
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        'Ngày không được bé hơn hôm nay',
      )
      .required('Loại phòng không được để trống'),
  });

  const form = useForm({
    defaultValues: { time: new Date(), date: new Date() },
    resolver: yupResolver(schema),
  });

  const {
    setError,
    formState: { errors, isDirty },
    clearErrors,
    reset,
    setValue,
    getValues,
  } = form;

  const onSelectedDay = d => {
    console.log(d);
  };

  const handleSubmit = async data => {
    console.log(new Date(data.date.setHours(0, 0, 0, 0)));
    console.log(new Date(data.time));
  };
  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DateField name="date" label="Time" form={form} />
        <TimeField name="time" label="Time" form={form} />
        <Button type="submit">cc</Button>
      </form>
    </div>
  );
}

export default AddEditShowTime;
