import { PrismaClient } from "@prisma/client";
import express from "express";
import { upload, uploadImage } from "./Controllers/GaleriaControllers-GrupoB";


const prisma= new PrismaClient();
const app=express();

const port = process.env.PORT || 5432 ;
app.use(express.json());

app.post('/upload', upload.single('image'), uploadImage);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });