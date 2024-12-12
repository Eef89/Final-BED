import { PrismaClient } from "@prisma/client";
// import NotFoundError from "../../errors/NotFoundError.js";

const updateReviewById = async (id, userId, propertyId, rating, comment) => {
  const prisma = new PrismaClient();
  const updatedreview = await prisma.review.updateMany({
    where: {
      id,
    },
    data: {
      userId,
      propertyId,
      rating,
      comment,
    },
  });

  return updatedreview.count > 0 ? id : null;
};

export default updateReviewById;
