/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2021-2022> <Yurii Andriiko>
 * http://yurets.info/
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
const { Markup } = require("telegraf");
import { UserModel } from "../model/user.model";

const messagesUA = require("../translate/messagesUA.json");
const messagesSU = require("../translate/messagesSU.json");
const messagesENG = require("../translate/messagesENG.json");

export const sendCatalogButton = async (options: { ctx: any }) => {
    // const { ctx } = options;
    // const chatId: number = ctx.chat.id;
    // const webAppUrl = "https://slinex-web-morda.vercel.app/";
    // const keyboard = [
    //     [
    //         {
    //             text: "url",
    //             web_app: { url: webAppUrl },
    //         },
    //     ],
    // ];
    // // Look for User in DB
    // const userData = await UserModel.findOne({ chatId });
    // let language = null;
    // userData && (language = userData.language);
    // // If there are no user or user select UA we write on UA
    // if (!language || language === "ua") {
    //     return await ctx.reply(
    //         `${messagesUA.catalog}`,
    //         Markup.inlineKeyboard(keyboard)
    //     );
    // }
    // if (language === "su") {
    //     return await ctx.reply(
    //         `${messagesSU.catalog}`,
    //         Markup.inlineKeyboard(keyboard)
    //     );
    // }
    // if (language === "eng") {
    //     return await ctx.reply(
    //         `${messagesENG.catalog}`,
    //         Markup.inlineKeyboard(keyboard)
    //     );
    // }
};
