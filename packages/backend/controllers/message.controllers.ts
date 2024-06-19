import { Request, Response } from "express";
import { prisma } from "../services/db";
import * as response from "../services/response";
import { ReceiverTypeEnum } from "../enum";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const newMessage = {
      senderId: req.body.senderId,
      singleReceiverId:
        req.body.receiverType === ReceiverTypeEnum.SINGLE
          ? req.body.receiverId
          : null,
      groupReceiverId:
        req.body.receiverType === ReceiverTypeEnum.GROUP
          ? req.body.receiverId
          : null,
      messageData: req.body.messageData,
      receiverType: req.body.receiverType,
    };

    const createMessage = await prisma.message.create({
      data: newMessage,
    });
    if (ReceiverTypeEnum.GROUP === req.body.receiverType) {
      await prisma.groupMember.update({
        where: {
          groupIdUserId: {
            groupId: req.body.receiverId,
            userId: req.body.senderId,
          },
        },

        data: {
          lastSeen: new Date(),
        },
      });
    }
    await prisma.$disconnect();
    return res
      .status(201)
      .send(response.createResponse(createMessage, "message"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    const chatWithId = req.query.chatWithUserId;
    const receiverType = req.query.receiverType;

    if (
      !userId ||
      !chatWithId ||
      !(typeof userId === "string") ||
      !(typeof chatWithId === "string") ||
      !receiverType ||
      !(typeof receiverType === "string")
    ) {
      return res.status(400).send("user ID not found");
    }
    if (receiverType === ReceiverTypeEnum.GROUP) {
      const getMessage = await prisma.message.findMany({
        where: {
          groupReceiverId: chatWithId,
          receiverType: receiverType,
        },
        include: {
          sender: {
            select: {
              email: true,
              firstName: true,
              userId: true,
              lastName: true,
              userStatus: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      await prisma.groupMember.update({
        where: {
          groupIdUserId: {
            groupId: chatWithId,
            userId: userId,
          },
        },

        data: {
          lastSeen: new Date(),
        },
      });

      await prisma.$disconnect();
      return res.status(200).send(response.getResponse(getMessage, "messages"));
    } else if (receiverType === ReceiverTypeEnum.SINGLE) {
      const getMessage = await prisma.message.findMany({
        where: {
          OR: [
            {
              singleReceiverId: chatWithId,
              senderId: userId,
              receiverType: receiverType,
            },
            {
              singleReceiverId: userId,
              senderId: chatWithId,
              receiverType: receiverType,
            },
          ],
        },

        orderBy: {
          createdAt: "desc",
        },
      });
      const timeofRead = new Date();
      await prisma.message.updateMany({
        where: {
          senderId: chatWithId,
          singleReceiverId: userId,
          readStatus: false,
          createdAt: {
            lt: timeofRead,
          },
        },
        data: {
          readStatus: true,
        },
      });
      await prisma.$disconnect();
      return res.status(200).send(response.getResponse(getMessage, "messages"));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const getLatestMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    const chatWithId = req.query.chatWithUserId;
    const receiverType = req.query.receiverType;

    if (
      !userId ||
      !chatWithId ||
      !(typeof userId === "string") ||
      !(typeof chatWithId === "string") ||
      !receiverType ||
      !(typeof receiverType === "string")
    ) {
      return res.status(400).send("user ID not found");
    }
    if (receiverType === ReceiverTypeEnum.SINGLE) {
      const getMessage = await prisma.message.findMany({
        where: {
          singleReceiverId: userId,
          senderId: chatWithId,
          receiverType: "SINGLE",
          readStatus: false,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      await prisma.message.updateMany({
        where: {
          singleReceiverId: userId,
          senderId: chatWithId,
          receiverType: "SINGLE",
          readStatus: false,
        },
        data: {
          readStatus: true,
        },
      });

      await prisma.$disconnect();
      return res
        .status(200)
        .send(response.getResponse(getMessage, "Latest messages"));
    } else if (receiverType === ReceiverTypeEnum.GROUP) {
      const lastSeenTime = await prisma.groupMember.findUnique({
        where: {
          groupIdUserId: {
            groupId: chatWithId,
            userId: userId,
          },
        },
        select: {
          lastSeen: true,
        },
      });
      if (lastSeenTime?.lastSeen) {
        const getMessage = await prisma.message.findMany({
          where: {
            groupReceiverId: chatWithId,
            receiverType: "GROUP",
            createdAt: {
              gte: lastSeenTime.lastSeen,
            },
          },
          include: {
            sender: {
              select: {
                email: true,
                firstName: true,
                userId: true,
                lastName: true,
                userStatus: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        await prisma.groupMember.update({
          where: {
            groupIdUserId: {
              groupId: chatWithId,
              userId: userId,
            },
          },

          data: {
            lastSeen: new Date(),
          },
        });

        await prisma.$disconnect();
        return res
          .status(200)
          .send(response.getResponse(getMessage, "messages"));
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.query.senderId;
    const deleteMessageId = req.query.messageId;
    if (
      !senderId ||
      !deleteMessageId ||
      !(typeof senderId === "string") ||
      !(typeof deleteMessageId === "string")
    ) {
      return res.status(400).send("user ID not found");
    }
    const deleteMessage = await prisma.message.delete({
      where: { messageId: deleteMessageId, senderId: senderId },
      select: {
        messageId: true,
        senderId: true,
      },
    });

    await prisma.$disconnect();
    return res
      .status(200)
      .send(response.deleteResponse(deleteMessage, "message"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
