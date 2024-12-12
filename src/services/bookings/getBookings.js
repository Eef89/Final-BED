import { PrismaClient } from "@prisma/client";

const getBookings = async (userId) => {
  const prisma = new PrismaClient();

  return prisma.booking.findMany({
    include: { user: true, property: true },
    where: {
      userId,
    },
  });
};

export default getBookings;
