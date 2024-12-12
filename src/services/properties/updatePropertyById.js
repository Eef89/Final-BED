import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updatePropertyById = async (
  id,
  hostId,
  title,
  description,
  location,
  pricePerNight,
  bedroomCount,
  bathRoomCount,
  maxGuestCount,
  rating
) => {
  const prisma = new PrismaClient();
  const updatedProperty = await prisma.property.updateMany({
    where: {
      id,
    },
    data: {
      hostId,
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
    },
  });

  return updatedProperty.count > 0 ? id : null;
};

export default updatePropertyById;
