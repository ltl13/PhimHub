import removeAccents from 'utils/removeAccents';

export default function stableSortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  if (query) {
    return array.filter(
      func =>
        removeAccents(func.funcName.toLowerCase()).indexOf(
          removeAccents(query.toLowerCase()),
        ) !== -1,
    );
  }
  return stabilizedThis.map(el => el[0]);
}
