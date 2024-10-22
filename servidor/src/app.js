import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.routes.js";
import cookieParser from "cookie-parser";



const app = express();

app.use(express.json());

app.use((req, res, next) => {
  //res.header('Access-Control-Allow-Origin', 'https://inventarios.espoch.edu.ec/');
  res.header('Access-Control-Allow-Origin', 'https://pruebasinventario.me/');
  res.header('Access-Control-Allow-Origin', 'http://54.91.59.99');
  
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const whiteList = [
  //"https://pruebasw.espoch.edu.ec:3011/",
  "http://localhost:4200",
  "https://localhost:4200",
  "https://inventario-espoch.rubenvn.com",
  "http://54.91.59.99/",
  "https://pruebasinventario.me/"
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

