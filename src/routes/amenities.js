import express from "express";
import getAmenities from "../services/amenities/getAmenities.js";
import getAmenityById from "../services/amenities/getAmenityById.js";
import deleteAmenity from "../services/amenities/deleteAmenity.js";
import updateAmenityById from "../services/amenities/updateUserById.js";
import createAmenity from "../services/amenities/createAmenity.js";

import authMiddleware from "../middleware/auth.js";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";

const router = express.Router();

// get amenities

router.get("/", async (req, res, next) => {
  try {
    // const { email, amenityname } = req.query;
    const amenities = await getAmenities();
    res.status(200).json(amenities);
  } catch (error) {
    next(error);
  }
});

// Get amenity by id

router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const amenity = await getAmenityById(id);
      res.status(200).json(amenity);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// Delete amenity by ID

router.delete(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedAmenityId = await deleteAmenity(id);

      res.status(200).json({
        message: `amenity with id ${deletedAmenityId} was deleted!`,
      });
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// // put amenity

router.put(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedAmenity = await updateAmenityById(id, name);
      res.status(200).json(updatedAmenity);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// // add amenity

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { name } = req.body;
    const newamenity = await createAmenity(name);
    res.status(201).json(newamenity);
  } catch (error) {
    if (error.code === "P2002") {
      res.status(409).json("amenity already exists Bro");
    } else if (error.name === "PrismaClientValidationError") {
      res.status(400).json({ message: `amenity fault: ${error.message}` });
    } else {
      next(error);
    }
  }
});

export default router;
