/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { UserModel } from "../model/user.model";

import { sendRegisterBtn } from "../utils/sendRegisterBtn";
import { handleDelayedSendMessage } from "../utils/handleDelayedSendMessage";
import { IMessages } from "../interfaces/IMessage";

export const handleStartCommand = async (options: {
    ctx: any;
    messagesUA: IMessages;
}): Promise<any> => {
    const { ctx, messagesUA } = options;
    const chatId: number = ctx.chat.id;
    const { first_name } = ctx.from;

    // Look for the same User in DB
    let userData = null;

    try {
        userData = await UserModel.findOne({ chatId });
    } catch (error) {
        console.log("[ERROR]:: Start command, find user", error.message);
    }

    // New User actions
    if (!userData) {
        await ctx.reply(
            `${first_name}, ${messagesUA.START_MESSAGE_1_NEW_USER}`
        );

        await handleDelayedSendMessage({
            delayValue: 1000,
            ctx,
            message: `${messagesUA.START_MESSAGE_2_NEW_USER}`,
        });

        await handleDelayedSendMessage({
            delayValue: 2000,
            ctx,
            message: `${messagesUA.START_MESSAGE_3_NEW_USER}`,
        });

        await handleDelayedSendMessage({
            delayValue: 5000,
            ctx,
            message: `${messagesUA.START_MESSAGE_4_NEW_USER}`,
        });

        await handleDelayedSendMessage({
            delayValue: 10000,
            ctx,
            message: `${messagesUA.START_MESSAGE_5_NEW_USER}`,
        });

        await handleDelayedSendMessage({
            delayValue: 5000,
            ctx,
            action: sendRegisterBtn,
        });
    }
};
