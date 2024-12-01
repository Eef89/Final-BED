import { PrismaClient } from "@prisma/client";

const getHosts = async (userId) => {
  const prisma = new PrismaClient();

  // aanpassen onderstaande!

  return prisma.host.findMany({
    where: {
      userId,
    },
  });
};

export default getHosts;
