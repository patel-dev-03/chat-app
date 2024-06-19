export const createResponse = (prismaResponse: any, objectName: string) => {
  return {
    Code: 201,
    message: `${objectName} has been created successfully`,
    data: prismaResponse,
  };
};

export const UpdateResponse = (prismaResponse: any, objectName: string) => {
  return {
    code: 200,
    message: `${objectName} has been updated successfully`,
    data: prismaResponse,
  };
};

export const getResponse = (prismResponse: any, objectName: string) => {
  return {
    code: 200,
    message: `${objectName} has been get successfully`,
    data: prismResponse,
  };
};

export const deleteResponse = (prismaResponse: any, objectName: string) => {
  return {
    code: 200,
    message: `${objectName} has been deleted successfully`,
    data: prismaResponse,
  };
};
