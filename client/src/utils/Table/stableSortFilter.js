export default function stableSortFilter(array, comparator, getFilter) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  if (getFilter) {
    return array.filter(item => getFilter(item));
  }
  return stabilizedThis.map(el => el[0]);
}
