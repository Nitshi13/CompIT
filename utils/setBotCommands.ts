/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
export const setBotCommands = async (bot: any): Promise<any> => {
  await bot.telegram.setMyCommands([
    {
      command: '/start',
      description: 'для старту 😉',
    },
    {
      command: '/catalog',
      description: 'переглянути каталог продукції 📘',
    },
    {
      command: '/protocols',
      description: 'протоколи по продукції 👩‍⚕️',
    },
    {
      command: '/seminars',
      description: 'запис на семінари 👩‍🎓',
    },
    // {
    //     command: "/promo",
    //     description: "промо активності 😉",
    // },
    {
      command: '/new_products',
      description: 'новинки 🌷',
    },
    {
      command: '/contact_us',
      description: "зв'язатися із менеджером ✍️",
    },
  ]);
};
