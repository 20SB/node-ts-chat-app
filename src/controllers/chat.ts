import { Request, Response } from "express";
import dbServices from "../services/dbServices";

export default class ChatController{
    static getPrivateChat = async (req: Request, res: Response) => {
        try {
            const { partnerId } = req.params;
            const userId = req.user;

            const abc = await dbServices.Chat.getprivateChatData(userId, partnerId);
            res.status(200).send({message:"Chat data fetched successfully.", chatData: abc})

        } catch (error: any) {
            res.status(500).send({ message: `Error getting chat: ${error.message}` });
        }
    }

}