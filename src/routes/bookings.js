import express from "express";
import getBookings from "../services/bookings/getBookings.js";
import getBookingById from "../services/bookings/getBookingById.js";
import deleteBooking from "../services/bookings/deleteBooking.js";
import updateBookingById from "../services/bookings/updateBookingById.js";
import createBooking from "../services/bookings/createBooking.js";
import authMiddleware from "../middleware/auth.js";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";

const router = express.Router();

// get bookings

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const bookings = await getBookings(userId);

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

// Get booking by id

router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const booking = await getBookingById(id);

      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// delete

router.delete(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedBookingId = await deleteBooking(id);

      res.status(200).json({
        message: `Booking with id ${deletedBookingId} was deleted!`,
      });
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// put booking

router.put(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        userId,
        propertyId,
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus,
      } = req.body;
      const updatedBooking = await updateBookingById(
        id,
        userId,
        propertyId,
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus
      );
      res.status(200).json(updatedBooking);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// add booking (add middleware!)

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;
    const newBooking = await createBooking(
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus
    );
    res.status(201).json(newBooking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.status(409).json({
        message:
          "User or Property does not exist...., so can not make the Booking",
      });
    } else if (error.name === "PrismaClientValidationError") {
      res.status(400).json({ message: `User fault: ${error.message}` });
    } else {
      next(error);
    }
  }
});

export default router;
