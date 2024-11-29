import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res) => {
  const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";
  const { username, password } = req.body;
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: { username, password },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }

  const token = jwt.sign({ userId: user.id }, secretKey, { noTimestamp: true });

  res.status(200).json({ message: "Successfully logged in!", token });
});

export default router;
