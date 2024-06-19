import { Request, Response } from "express";
import { prisma } from "../services/db";
import { RoleEnum } from "@prisma/client";
import * as response from "../services/response";

type createGroup = {
  description?: string;
  groupName: string;
};
type addGroupMember = {
  groupId: string;
  userId: string;
  userRole: RoleEnum;
};

export const createGroup = async (req: Request, res: Response) => {
  const adminId: string = req.params.userId;
  try {
    const group: createGroup = req.body;

    const createGroup = await prisma.group.create({
      data: {
        creatorId: adminId,
        description: group.description,
        groupName: group.groupName,
        members: {
          create: {
            role: "ADMIN",
            userId: adminId,
          },
        },
      },
      select: {
        description: true,
        groupId: true,
        groupName: true,
        creatorId: true,
        members: {
          select: {
            userId: true,
            groupMemberId: true,
            role: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    await prisma.$disconnect();
    return res.status(201).send(response.createResponse(createGroup, "group"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const createGroupMembers = async (req: Request, res: Response) => {


  const groupId = req.params.groupId;
  const addGroupMember: addGroupMember = req.body;

  if (!addGroupMember.userId) {
    return res.status(400).send("Please provide user ID to add!!!");
  }
  try {
    const createGroupMember = await prisma.groupMember.create({
      data: addGroupMember,
      include: {
        group: {
          select: {
            description: true,
            groupId: true,
            groupName: true,
            creatorId: true,
            members: {
              select: {
                groupMemberId: true,
                role: true,
                userId: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    await prisma.$disconnect();
    return res
      .status(201)
      .send(response.createResponse(createGroupMember, "group Member"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
export const deleteGroupMember = async (req: Request, res: Response) => {
  try {
    const groupMemberId: string = req.params.groupMemberId;
    const groupId = req.query.groupId;

    if (!groupMemberId || !(typeof groupId === "string") || !groupId) {
      return res.status(400).send("Please provide user ID to add!!!");
    }

    const deleteGroupMember = await prisma.groupMember.delete({
      where: {
        groupMemberId: groupMemberId,
        groupId: groupId,
        role: "MEMBER",
      },
      include: {
        group: {
          select: {
            description: true,
            groupId: true,
            groupName: true,
            creatorId: true,
            members: {
              where: {
                NOT: {
                  groupMemberId: groupMemberId,
                },
              },
              select: {
                groupMemberId: true,
                role: true,
                userId: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    await prisma.$disconnect();
    return res
      .status(201)
      .send(response.deleteResponse(deleteGroupMember, "group Member"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const deleteGroupId = req.query.groupId;
    const adminId = req.query.adminId;

    if (
      !deleteGroupId ||
      !adminId ||
      !(typeof deleteGroupId === "string") ||
      !(typeof adminId === "string")
    ) {
      return res.status(400).send("please provide groupId and adminId!!");
    }

    const deleteGroup = await prisma.group.delete({
      where: {
        groupId: deleteGroupId,
        creatorId: adminId,
      },
      select: {
        groupId: true,
        creatorId: true,
        groupName: true,
      },
    });

    await prisma.$disconnect();
    return res.status(200).send(response.deleteResponse(deleteGroup, "group"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const getGroups = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).send("userId not found");
    }
    const getGroup = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },

      select: {
        groupId: true,
        groupName: true,
        description: true,
        creatorId: true,
        members: {
          select: {
            groupMemberId: true,
            role: true,
            userId: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    await prisma.$disconnect();
    return res.status(200).send(response.getResponse(getGroup, "groups"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

export const getNonGroupMembers = async (req: Request, res: Response) => {
  const groupId = req.params.groupId;

  if (!groupId) {
    return res.status(400).send("Group ID not found");
  }
  try {
    const getNonGroupMembers = await prisma.user.findMany({
      where: {
        groupMemberships: {
          none: {
            groupId: groupId,
          },
        },
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        userId: true,
        userStatus: true,
      },
    });

    // let groupMembers = await prisma.groupMember.findMany({
    //   where: {
    //     groupId: groupId,
    //   },
    //   select: {
    //     userId: true,
    //   },
    // });

    // console.log("Group members:", groupMembers);

    // let groupMemberIds = groupMembers.map((member) => member.userId);
    // let getNonGroupMembers = await prisma.user.findMany({
    //   where: {
    //     NOT: {
    //       userId: {
    //         in: groupMemberIds,
    //       },
    //     },
    //   },
    // });

    //console.log("Group member ids:", groupMemberIds);
    // console.log(getNonGroupMembers);

    await prisma.$disconnect();
    return res
      .status(200)
      .send(response.getResponse(getNonGroupMembers, "Non group member"));
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
