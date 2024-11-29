import { PrismaClient } from "@prisma/client";
import getUserById from "../users/getUserById.js";
import notFoundErrorHandler from "../../middleware/notFoundErrorHandler.js";

const createBooking = async (
  userId,
  propertyId,
  checkinDate,
  checkoutDate,
  numberOfGuests,
  totalPrice,
  bookingStatus
) => {
  const prisma = new PrismaClient();

  const checkUserId = await getUserById(userId);

  // Nog maken voor property!

  return prisma.booking.create({
    data: {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    },
  });
};

export default createBooking;
