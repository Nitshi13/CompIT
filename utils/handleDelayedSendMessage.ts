/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2021-2022> <Yurii Andriiko>
 * http://yurets.info/
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { createDelayedSendMessage } from "./createDelayedSendMessage";

export const handleDelayedSendMessage = async (options: {
    delayValue: number;
    ctx: any;
    message?: string | number;
    action?: Function;
}) => {
    const { delayValue, ctx, message, action } = options;

    await createDelayedSendMessage(delayValue);
    message && (await ctx.reply(message, { parse_mode: "html" }));
    action && (await action({ ctx }));
};
