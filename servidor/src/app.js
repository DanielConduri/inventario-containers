import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.routes.js";
import cookieParser from "cookie-parser";



const app = express();

app.use(express.json());
const whiteList = [
  //"https://pruebasw.espoch.edu.ec:3011/",
  "http://localhost:4200",
  "https://localhost:4200",
  "https://inventario-espoch.rubenvn.com",
];

app.use(
  cors({
    credentials: true,
    origin: whiteList,
  })
);
app.use(cookieParser());
//app.305(validarCookies);

export default app;
app.use(indexRoutes);

