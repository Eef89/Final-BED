import NotFoundError from "../../errors/NotFoundError.js";
import { PrismaClient } from "@prisma/client";

const getBookingById = async (id) => {
  const prisma = new PrismaClient();
  const booking = await prisma.booking.findUnique({
    include: { user: true, property: true },
    where: {
      id,
    },
  });

  if (!booking) {
    throw new NotFoundError("Booking", id);
  }

  return booking;
};

export default getBookingById;
