import "reflect-metadata";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import expressRequestId from "express-request-id";
import log from "./logger";
// import { router as userRouter } from './routes/user.route'
import { helloSovrynHandler } from "./controllers/helloSovrynHandler";
import { toTheMoonHandler } from "./controllers/toTheMoonHandler";
import asyncMiddleware from "./utils/asyncMiddleware";
import responseTime from "response-time";
import errorHandler from "./errorHandlers/errorHandler";
import { HTTP404Error } from "./errorHandlers/baseError";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTime());
app.use(expressRequestId());
app.use(log);

app.use((req: Request, _res: Response, next: NextFunction) => {
  // TODO: printing req body for debug purposes
  req.log.info(req, `Incoming ${req.method} request to ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  req.log.info(req, "Sovryn boilerplate Service Running. Stay Sovryn.");
  res.send("Sovryn boilerplate Service Running. Stay Sovryn.");
});

app.get("/test", (req, res) => {
  req.log.info(req, "test");
  res.json({ message: "Pass!" });
});

app.post(
  "/helloSovryn",
  asyncMiddleware(async (req: Request, res: Response) => {
    req.log.info(req, "handling request for Hello Sovryn");
    const response = await helloSovrynHandler(req.body);
    res.send(response);
  })
);

app.post(
  "/toTheMoon",
  asyncMiddleware(async (req: Request, res: Response) => {
    const response = await toTheMoonHandler(req.body);
    req.log.info(response, "service returned for To The Moon");
    res.send(response);
  })
);

// app.use('/user/', userRouter)

app.use(function (_req: Request, res: Response, _next: NextFunction) {
  res.status(404).send("Sorry can't find that!");
});

app.use(function (_req: Request, _res: Response, _next: NextFunction) {
  throw new HTTP404Error();
});

app.use(errorHandler.handleError);

export default app;
