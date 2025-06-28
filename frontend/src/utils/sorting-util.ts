export function sortToQueryParam(sortArray: any[]): string {
  return sortArray.map(({ id, desc }) => (desc ? `-${id}` : id)).join(',');
}
