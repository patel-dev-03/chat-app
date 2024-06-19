import { Request, Response } from "express";
import { prisma } from "../services/db";
import * as response from "../services/response";

export const getAllConversationUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).send("User Id not found!!!");
    }
    const getAllUser = await prisma.user.findMany({
      where: {
        NOT: {
          userId: userId,
        },
      },

      include: {
        // messagesReceived: {
        //   take: 1,
        //   where: {
        //     readStatus: false,
        //     singleReceiverId: userId,
        //   },

        //   orderBy: {
        //     createdAt: "desc",             
        //   },
        // },

        _count: {
          select: {
            messagesSent: {
              where: {
                readStatus: false,
              },
            },
          },
        },
      },
    }); 

    await prisma.$disconnect();
    return res.status(200).send(response.getResponse(getAllUser, "chat user"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
