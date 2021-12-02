import removeAccents from './removeAccents';

export default function getFilter(query, ...filterBy) {
  if (query)
    return item => {
      let checker = false;
      filterBy.forEach(filter => {
        checker =
          checker ||
          (!!item[filter] &&
            removeAccents(item[filter].toString().toLowerCase()).indexOf(
              removeAccents(query.toLowerCase()),
            ) !== -1);
      });
      return checker;
    };
}
