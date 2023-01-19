import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

export const getProducts = async (
    req: Request,
    res: Response
): Promise<any> => {
    const category = req.query?.category;

    if (!category) {
        return res.send({
            status: 400,
            message: "Не задана категорія для запиту!",
        });
    }

    try {
        let result = {};
        const BASE_URL: string = process.env["SLINEX_CATALOG_BASE_URL"];

        const response: AxiosResponse<any> = await axios.get(
            BASE_URL + `?category=${category}`
        );
        const { status, data } = response;

        if (status !== 200) {
            return res.send({
                status: 400,
                message: "Гугл таблиця не відповідає ...",
            });
        }

        const { data: responseValue } = data;
        result = responseValue;

        res.send(result);
    } catch (error) {
        res.status(500).json({
            message: "Запит не виконано, спробуйте повторити пізніше ...",
        });
    }
};
