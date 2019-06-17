export function page(page: number, url: string) {
  const concatChar = url.indexOf('?') === -1 ? '?' : '&';
  return `${url}${concatChar}pg=${page}`;
}

export function pageWith(page: number, itemsPerPage: number, url: string) {
  const concatChar = url.indexOf('?') === -1 ? '?' : '&';
  return `${url}${concatChar}pg=${page}&itensPg=${itemsPerPage}`;
}
