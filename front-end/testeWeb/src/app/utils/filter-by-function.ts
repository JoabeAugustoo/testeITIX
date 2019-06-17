export interface FilterByOptions {
  recursive?: boolean;
  dateSeparator?: string;
}
export function filterBy(filter: any, url: string, options?: FilterByOptions) {
  const recursive = options && options.recursive;
  const dateSeparator = options && options.dateSeparator || '-';
  const joinParams = (obj: any, prepend?: string) => {
    const arr = [];
    Object.keys(obj)
      .filter(key => {
        const value = obj[key];
        return value !== null && value !== undefined && (value instanceof Date || typeof value !== 'object' || recursive);
      })
      .forEach(key => {
        const value = obj[key];
        let str: string;
        if (typeof value === 'object') {
          str = value instanceof Date
            ? `${prepend || ''}${key}=${dateToString(value, dateSeparator)}`
            : joinParams(value, `${prepend || ''}${key}.`);
        } else {
          str = `${prepend || ''}${key}=${value}`;
        }
        if (str) {
          arr.push(str);
        }
      });
    return arr.length ? arr.join('&') : null;
  };

  if (!filter || typeof filter !== 'object') {
    return url;
  }

  const filterUrl = joinParams(filter);
  if (!filterUrl) {
    return url;
  }

  const concatChar = url.indexOf('?') === -1 ? '?' : '&';
  return `${url}${concatChar}${filterUrl}`;
}

function dateToString(date: Date, separator: string) {
  return [
    ('0' + (date.getMonth() + 1)).slice(-2),
    ('0' + date.getDate()).slice(-2),
    date.getFullYear()
  ].join(separator);
};
