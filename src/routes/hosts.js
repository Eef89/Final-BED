import express from "express";
import getHosts from "../services/hosts/getHosts.js";
import getHostById from "../services/hosts/getHostById.js";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";
import deleteHost from "../services/hosts/deleteHost.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// get hosts

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const hosts = await getHosts(userId);

    res.status(200).json(hosts);
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
      const host = await getHostById(id);

      res.status(200).json(host);
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
      const deletedHostId = await deleteHost(id);

      res.status(200).json({
        message: `Host with id ${deletedHostId} was deleted!`,
      });
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// // put booking

// router.put(
//   "/:id",
//   authMiddleware,
//   async (req, res, next) => {
//     try {
//       const { id } = req.params;
//       const {
//         userId,
//         propertyId,
//         checkinDate,
//         checkoutDate,
//         numberOfGuests,
//         totalPrice,
//         bookingStatus,
//       } = req.body;
//       const updatedBooking = await updateBookingById(
//         id,
//         userId,
//         propertyId,
//         checkinDate,
//         checkoutDate,
//         numberOfGuests,
//         totalPrice,
//         bookingStatus
//       );
//       res.status(200).json(updatedBooking);
//     } catch (error) {
//       next(error);
//     }
//   },
//   notFoundErrorHandler
// );

// // add booking (add middleware!)

// router.post("/", authMiddleware, async (req, res, next) => {
//   try {
//     const {
//       userId,
//       propertyId,
//       checkinDate,
//       checkoutDate,
//       numberOfGuests,
//       totalPrice,
//       bookingStatus,
//     } = req.body;
//     const newBooking = await createBooking(
//       userId,
//       propertyId,
//       checkinDate,
//       checkoutDate,
//       numberOfGuests,
//       totalPrice,
//       bookingStatus
//     );
//     res.status(201).json(newBooking);
//   } catch (error) {
//     if (error.name === "NotFoundError") {
//       res.status(409).json({
//         message:
//           "User or Property does not exist...., so can not make the Booking",
//       });
//     } else if (error.name === "PrismaClientValidationError") {
//       res.status(400).json({ message: `User fault: ${error.message}` });
//     } else {
//       next(error);
//     }
//   }
// });

export default router;
