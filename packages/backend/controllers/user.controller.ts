import { Request, Response } from "express";
import { prisma } from "../services/db";
import * as response from "../services/response";
export const createUser = async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const createUser = await prisma.user.create({
      data: req.body,
    });

    await prisma.$disconnect();
    return res.status(201).send(response.createResponse(createUser, "user"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const clerkId = req.params.clerkId;
    if (!clerkId) {
      return res.status(400).send("Please provide clerkId!!!");
    }
    const getUser = await prisma.user.findFirstOrThrow({
      where: { clerkId: clerkId },
    });
    await prisma.$disconnect();
    return res.status(200).send(response.getResponse(getUser, "user"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const clerkId = req.params.clerkId;
    const updateUserdata = req.body;

    if (!clerkId) {
      return res.status(400).send("Please provide clerk Id !!!");
    }
    const updateUser = await prisma.user.update({
      where: { clerkId: clerkId },
      data: {
        ...updateUserdata,
      },
    });
    await prisma.$disconnect();
    return res.status(200).send(response.UpdateResponse(updateUser, "user"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
