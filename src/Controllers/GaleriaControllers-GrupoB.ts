import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/images'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

export const upload = multer({ storage});

export async function uploadImage(req: Request, res: Response){
    if(!req.file){
        return res.status(400).send('No se subio ningún archivo.');
    }
    
    const { filename } = req.file;
    const { description, userRole } = req.body;
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${filename}`;

    try {
        const user = await prisma.user.findUnique({
          where: { UserRole: userRole }
        });
    
        if (!user) {
          return res.status(404).json({ message: 'UserRole no encontrado' });
        }
    
        const galleryEntry = await prisma.gallery.create({
          data: {
            imgName: filename,
            ImageUrl: imageUrl,
            Description: description,
            User_role: userRole
          }
        });
    
        res.status(200).json(galleryEntry);
    }catch (error) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
}
