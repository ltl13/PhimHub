import removeAccents from './removeAccents';

export default function descendingComparator(a, b, orderBy) {
  if (typeof a[orderBy] === 'string') {
    const strA = removeAccents(a[orderBy]);
    const strB = removeAccents(b[orderBy]);
    if (strB < strA) {
      return -1;
    }
    if (strB > strA) {
      return 1;
    }
    return 0;
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
}
