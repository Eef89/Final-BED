import express from "express";
import getUsers from "../services/users/getUsers.js";
import getUserById from "../services/users/getUserById.js";
import deleteUser from "../services/users/deleteUser.js";
import updateUserById from "../services/users/updateUserById.js";
import createUser from "../services/users/createUser.js";
import authMiddleware from "../middleware/auth.js";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";

const router = express.Router();

// get users

router.get("/", async (req, res, next) => {
  try {
    const { email, username } = req.query;
    const users = await getUsers(email, username);

    const usersWithoutPassword = users.map(
      ({ password, ...restOfUser }) => restOfUser
    );
    // onderstaande om enkel een bepaalde waarde uit de review te
    // const result = usersWithoutPassword.map((post) => {
    //   return { ...post, reviews: post.reviews.map((tag) => tag.id) };
    // });
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Get user by id

router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await getUserById(id);
      const { password, ...withoutPassword } = user;
      res.status(200).json(withoutPassword);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// Delete user by ID

router.delete(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedUserId = await deleteUser(id);

      res.status(200).json({
        message: `User with id ${deletedUserId} was deleted!`,
      });
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// put user

router.put(
  "/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { username, password, name, email, phoneNumber, profilePicture } =
        req.body;
      const updatedUser = await updateUserById(
        id,
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// add user

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { username, password, name, email, phoneNumber, profilePicture } =
      req.body;
    const newUser = await createUser(
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture
    );
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "P2002") {
      res.status(409).json("user already exists Bro");
    } else if (error.name === "PrismaClientValidationError") {
      res.status(400).json({ message: `user fault: ${error.message}` });
    } else {
      next(error);
    }
  }
});

export default router;
