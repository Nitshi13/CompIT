/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2021-2022> <Yurii Andriiko>
 * http://yurets.info/
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import { UserModel } from "../model/user.model";

const messagesUA = require("../translate/messagesUA.json");
const messagesSU = require("../translate/messagesSU.json");
const messagesENG = require("../translate/messagesENG.json");

export const setBotLanguage = async (options: {
    ctx: any;
    language: string;
}): Promise<any> => {
    const { ctx, language } = options;
    const chatId = ctx?.update?.callback_query?.from?.id;
    let updatedUserData = null;

    try {
        // Look for User in DB
        const userData = await UserModel.findOne({ chatId });

        if (!userData && language === "UA") {
            return await ctx.reply(messagesUA.newUserViaLanguageSelect);
        }

        if (!userData && language === "SU") {
            return await ctx.reply(messagesSU.newUserViaLanguageSelect);
        }

        if (!userData && language === "ENG") {
            return await ctx.reply(messagesENG.newUserViaLanguageSelect);
        }

        updatedUserData = await UserModel.findOneAndUpdate(
            { chatId },
            { language }
        );

        if (language === "UA") {
            !updatedUserData && (await ctx.reply(messagesUA.errorDB1));
            updatedUserData &&
                (await ctx.reply(messagesUA.setUALanguageMessage));
        } else if (language === "SU") {
            !updatedUserData && ctx.reply(messagesSU.errorDBset);
            updatedUserData && ctx.reply(messagesSU.setSULanguageMessage);
        } else if (language === "ENG") {
            !updatedUserData && ctx.reply(messagesENG.errorDB);
            updatedUserData && ctx.reply(messagesENG.setENGLanguageMessage);
        }
    } catch (error) {
        // TODO: Send error message to Admin via Telegram
        console.log("[ERROR]:: Set language, update user data", error.message);
    }
};
