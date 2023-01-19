/**
 * Made by Yurets in UA!
 * Copyright (c) GPL License <2023> <Yurii Andriiko>
 * Telegram @Yurets7777 E-mail: yuretshome@gmail.com
 * "Роби добре, та тільки добре! А можеш? - Роби краще!"
 */
import Mongoose = require("mongoose");
require("dotenv").config();

let database: Mongoose.Connection;

export const connect = () => {
    const url = process.env.PELART_MONGO_URL;

    if (database) {
        return;
    }

    Mongoose.connect(url, {});

    database = Mongoose.connection;

    console.log(
        "from connect: process.env.SLINEX_MONGO_URL :::",
        process.env.PELART_MONGO_URL
    );

    database.once("open", async () => {
        console.log("Connected to database");
    });

    database.on("error", () => {
        console.log("Error connecting to database");
    });
};

export const disconnect = () => {
    if (!database) {
        return;
    }

    Mongoose.disconnect();

    database.once("close", async () => {
        console.log("Diconnected  to database");
    });
};
