import NotFoundError from "../../errors/NotFoundError.js";
import { PrismaClient } from "@prisma/client";

const getHostById = async (id) => {
  const prisma = new PrismaClient();
  const host = await prisma.host.findUnique({
    include: { listings: true },
    where: {
      id,
    },
  });

  if (!host) {
    throw new NotFoundError("Host", id);
  }

  return host;
};

export default getHostById;
