import express from "express";
import getReviews from "../services/review/getReviews.js";
import getReviewById from "../services/review/getReviewById.js";
import deleteReview from "../services/review/deleteReview.js";
import updateReviewById from "../services/review/updateReviewById.js";
import createReview from "../services/review/createReview.js";

import authMiddleware from "../middleware/auth.js";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";

const router = express.Router();

// get reviews

router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews();

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

// Get reviews by id

router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const review = await getReviewById(id);

      res.status(200).json(review);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// // delete

router.delete(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedReviewId = await deleteReview(id);

      res.status(200).json({
        message: `reviews with id ${deletedReviewId} was deleted!`,
      });
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// // // put reviews

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, propertyId, rating, comment } = req.body;
    const updatedReviews = await updateReviewById(
      id,
      userId,
      propertyId,
      rating,
      comment
    );

    if (updatedReviews) {
      res.status(200).send({
        message: `User with id ${id} successfully updated`,
      });
    } else {
      res.status(404).json({
        message: `User with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

// // // add reviews

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;
    const newReview = await createReview(userId, propertyId, rating, comment);
    res.status(201).json(newReview);
  } catch (error) {
    if (error.name === "NotFoundError") {
      // Not in use right now. Can be used by running a test first, if user or revies exists.
      res.status(409).json({
        message:
          "User or property does not exist...., so can not make the reviews",
      });
    } else if (error.name === "PrismaClientValidationError") {
      res.status(400).json({ message: `User fault: ${error.message}` });
    } else {
      next(error);
    }
  }
});

export default router;
