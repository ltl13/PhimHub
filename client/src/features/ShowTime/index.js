import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import DateField from 'custom-fields/DateField';
import TimeField from 'custom-fields/TimeField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

function ShowTime(props) {
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

  const handleSubmit = async data => {
    console.log(
      new Date(
        data.date.setHours(data.time.getHours(), data.time.getMinutes(), 0, 0) +
          60000 * 90,
      ),
    );
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

export default ShowTime;
