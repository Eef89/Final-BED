import NotFoundError from "../../errors/NotFoundError.js";
import { PrismaClient } from "@prisma/client";

const getUserById = async (id) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    include: { reviews: true, bookings: true },
    where: {
      id,
    },
  });

  if (!user) {
    throw new NotFoundError("User", id);
  }

  return user;
};

export default getUserById;
