import { TableBody, TableCell, TableRow, Typography } from '@mui/material';

export default function SearchNotFound({ message }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
          <Typography gutterBottom align="center" variant="subtitle1">
            {message}
          </Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
