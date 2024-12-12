import express from "express";
import getHosts from "../services/hosts/getHosts.js";
import getHostById from "../services/hosts/getHostById.js";
import updateHostById from "../services/hosts/updateHostById.js";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";
import deleteHost from "../services/hosts/deleteHost.js";
import authMiddleware from "../middleware/auth.js";
import createHost from "../services/hosts/createHost.js";

const router = express.Router();

// get hosts

router.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;
    const hosts = await getHosts(name);
    const hostsWithoutPassword = hosts.map(
      ({ password, ...restOfHost }) => restOfHost
    );
    const result = hostsWithoutPassword.map((post) => {
      return {
        ...post,
        listings: post.listings.map((listing) => listing.title),
      };
    });
    res.status(200).json(result);
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
      const { password, ...withoutPassword } = host;
      const result = {
        ...host,
        listings: host.listings.map((listing) => listing.title),
      };
      res.status(200).json(result);
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

// // put Host

router.put(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe,
      } = req.body;
      const updatedHost = await updateHostById(
        id,
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe
      );
      res.status(200).json(updatedHost);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// Add host

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    } = req.body;
    const newUser = await createHost(
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe
    );
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "P2002") {
      res.status(409).json("Host already exists Bro");
    } else if (error.name === "PrismaClientValidationError") {
      res.status(400).json({ message: `user fault: ${error.message}` });
    } else {
      next(error);
    }
  }
});

export default router;
