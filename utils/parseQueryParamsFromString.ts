/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
export const parseQueryParamsFromString = (queryString: string): { [key: string]: string | number } => {
  let result = {};

  if (!queryString) {
    return result;
  }

  const startQueryString: number = queryString.indexOf('?') + 1;
  const endQueryString: number = queryString.length;
  const formattedString: string = queryString.substring(startQueryString, endQueryString);
  const pairs: Array<string> | [] = formattedString.split('&');

  for (var i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');

    result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }

  return result;
};
