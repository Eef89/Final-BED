import { PrismaClient } from "@prisma/client";

const getProperties = async (location, pricePerNight, amenities) => {
  const prisma = new PrismaClient();

  return prisma.property.findMany({
    where: {
      location,
      pricePerNight,
      amenities,
    },
  });
};

export default getProperties;
