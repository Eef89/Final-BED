import express from "express";
//handlers
import log from "./middleware/log.js";
import errorHandler from "./middleware/errorHandler.js";
//routers
import loginRouter from "./routes/login.js";
import userRouter from "./routes/users.js";
import bookingRouter from "./routes/bookings.js";
import hostRouter from "./routes/hosts.js";

const app = express();

app.use(express.json());
app.use(log);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/login", loginRouter);
app.use("/users", userRouter);
app.use("/bookings", bookingRouter);
app.use("/hosts", hostRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
