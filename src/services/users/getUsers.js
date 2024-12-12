import { PrismaClient } from "@prisma/client";

const getUsers = async (email, username) => {
  const prisma = new PrismaClient();

  return prisma.user.findMany({
    include: { reviews: true, bookings: true },
    where: {
      username,
      email,
    },
  });
};

export default getUsers;
