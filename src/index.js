import express from "express";
//handlers
import log from "./middleware/log.js";
import errorHandler from "./middleware/errorHandler.js";
import * as Sentry from "@sentry/node";

//routers
import loginRouter from "./routes/login.js";
import userRouter from "./routes/users.js";
import bookingRouter from "./routes/bookings.js";
import hostRouter from "./routes/hosts.js";
import amenitiesRouter from "./routes/amenities.js";
import propertiesRouter from "./routes/properties.js";
import reviewRouter from "./routes/reviews.js";

const app = express();

Sentry.init({
  dsn: "https://fe1b90efe7fe9efbfa89f67f17d420cc@o4508455731658752.ingest.de.sentry.io/4508455755710544",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use(log);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

// testen sentry!
// app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
// });

app.use("/login", loginRouter);
app.use("/users", userRouter);
app.use("/bookings", bookingRouter);
app.use("/hosts", hostRouter);
app.use("/amenities", amenitiesRouter);
app.use("/properties", propertiesRouter);
app.use("/reviews", reviewRouter);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
