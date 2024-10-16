export default function GetFinalFiltersQuery(filters: any) {
  let finalFilters = '?';
  if (filters) {
    if (filters.pagination) {
      finalFilters += `pagination=${JSON.stringify(filters.pagination)}`;
    } else {
      finalFilters += `pagination={"page":1,"limit":10}`;
    }
    if (filters.filter) {
      finalFilters += `&filter=${JSON.stringify(filters.filter)}`;
    }
    if (filters.sort) {
      finalFilters += `&sort=${JSON.stringify(filters.sort)}`;
    }
    if (filters.type) {
      finalFilters += `&type=${filters.type}`;
    }
    if (filters.order) {
      finalFilters += `&order=${JSON.stringify(filters.order)}`;
    }
  }
  return finalFilters;
}
