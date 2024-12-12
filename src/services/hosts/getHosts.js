import { PrismaClient } from "@prisma/client";

const getHosts = async (name) => {
  const prisma = new PrismaClient();

  // aanpassen onderstaande!

  return prisma.host.findMany({
    include: { listings: true },
    where: {
      name,
    },
  });
};

export default getHosts;
