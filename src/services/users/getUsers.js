import { PrismaClient } from "@prisma/client";

const getUsers = async (email, username) => {
  const prisma = new PrismaClient();
  console.log(prisma.user.reviews);

  return prisma.user.findMany({
    where: {
      username,
      email,
    },
  });
};

export default getUsers;
