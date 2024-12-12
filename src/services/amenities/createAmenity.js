import { PrismaClient } from "@prisma/client";

const createAmenity = async (name) => {
  const prisma = new PrismaClient();

  return prisma.amenity.create({
    data: {
      name,
    },
  });
};
export default createAmenity;
