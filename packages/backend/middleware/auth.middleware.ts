import { Request, Response, NextFunction } from "express";
import { prisma } from "../services/db";

export const loginPerson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const emailAddress = req.headers["authorization"];
  if (!emailAddress) {
    return res.status(401).send("You are unauthorized!!");
  }

  const userValue = await prisma.user.findFirst({
    where: { email: emailAddress as string },
  });
  if (userValue && userValue.userId) {
    userValue.email === emailAddress;

    next();
  } else {
    return res.status(401).send("You are unauthorized!!");
  }
};
