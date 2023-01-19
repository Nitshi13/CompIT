/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require("telegraf");

import MESSAGES_AU from "../translate/messagesUA.json";

export const sendRegisterBtn = async (options: { ctx: any }) => {
    const { ctx } = options;

    const keyboard = [
        [Markup.button.callback("Зареєструватися", "registerNewUser")],
    ];

    return await ctx.reply(
        `${MESSAGES_AU.REGISTER_BTN_MESSAGE}`,
        Markup.inlineKeyboard(keyboard)
    );
};
