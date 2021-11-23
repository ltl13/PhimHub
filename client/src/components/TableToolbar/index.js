import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { InputAdornment, OutlinedInput, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 350,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

export default function TableToolbar({
  filterName,
  onFilterName,
  placeholder,
}) {
  return (
    <RootStyle>
      <SearchStyle
        value={filterName}
        onChange={onFilterName}
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start">
            <SearchRoundedIcon />
          </InputAdornment>
        }
      />
    </RootStyle>
  );
}
