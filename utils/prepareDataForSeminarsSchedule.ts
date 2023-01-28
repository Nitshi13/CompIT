/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
export interface ISeminarItem {
  id?: string;
  date?: string;
  time?: string;
  title?: string;
  status?: string;
}

export const prepareDataForSeminarsSchedule = (seminarsData: Array<string[]> = []): Array<ISeminarItem> => {
  let result: [] | Array<ISeminarItem> = [];
  const isSeminarsData: boolean = !!seminarsData.length || seminarsData.length === 1;

  if (!isSeminarsData) {
    return result;
  }

  const keysForDataObjects: Array<string> = seminarsData[0];
  seminarsData.shift();

  result = seminarsData.map((row) =>
    row.reduce((result, field, index) => ({ ...result, [keysForDataObjects[index]]: field }), {}),
  );

  return result;
};
