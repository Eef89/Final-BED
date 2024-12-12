import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const deleteReview = async (id) => {
  const prisma = new PrismaClient();

  const deleteReview = await prisma.review.deleteMany({
    where: {
      id,
    },
  });

  if (!deleteReview || deleteReview.count === 0) {
    throw new NotFoundError("review", id);
  }

  return id;
};
export default deleteReview;
