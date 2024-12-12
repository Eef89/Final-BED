import express from "express";
import getProperties from "../services/properties/getProperties.js";
import getAmenityById from "../services/amenities/getAmenityById.js";
import getPropertyById from "../services/properties/getPropertyById.js";
import deleteProperty from "../services/properties/deleteProperty.js";
import updatePropertyById from "../services/properties/updatePropertyById.js";
import createProperty from "../services/properties/createProperty.js";

import authMiddleware from "../middleware/auth.js";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";

const router = express.Router();

// get properties

router.get("/", async (req, res, next) => {
  try {
    const { location, pricePerNight, amenities } = req.query;
    let pricePerNightToJson = undefined;
    if (!isNaN(pricePerNight)) {
      pricePerNightToJson = JSON.parse(pricePerNight);
    }
    const properties = await getProperties(
      location,
      pricePerNightToJson,
      amenities
    );

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
});

// Get properties by id

router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const property = await getPropertyById(id);

      res.status(200).json(property);
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
      const deletedPropertyId = await deleteProperty(id);

      res.status(200).json({
        message: `properties with id ${deletedPropertyId} was deleted!`,
      });
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// // put properties

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      hostId,
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
    } = req.body;
    const updatedproperties = await updatePropertyById(
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
    );

    if (updatedproperties) {
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

// // add properties

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const {
      hostId,
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
    } = req.body;
    const newProperty = await createProperty(
      hostId,
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating
    );
    res.status(201).json(newProperty);
  } catch (error) {
    if (error.name === "NotFoundError") {
      // Not in use right now. Can be used by running a test first, if user or revies exists.
      res.status(409).json({
        message:
          "User or Property does not exist...., so can not make the properties",
      });
    } else if (error.name === "PrismaClientValidationError") {
      res.status(400).json({ message: `User fault: ${error.message}` });
    } else {
      next(error);
    }
  }
});

export default router;
