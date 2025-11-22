import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { randomBytes } from 'crypto';
import fs from 'fs';

const subfolderMap: { [key:string]: string } = {
    'image/jpeg': 'images',
    'image/png': 'images',
    'image/gif': 'images',
    'image/webp': 'images',
    'application/pdf': 'manuals'
};
// Define onde e como os arquivos serão armazenados
const uploadBaseDir = path.join("src", 'public', 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const subfolder = subfolderMap[file.mimetype];
        if (!subfolder) {
            return cb(new Error('Tipo de arquivo não suportado.'), '');
        }

        const destinationPath = path.join(uploadBaseDir, subfolder);

        // Garante que a pasta de destino exista
        fs.mkdirSync(destinationPath, { recursive: true });

        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}-${Date.now()}${extension}`);
    }
});

// Filtro para aceitar apenas os tipos de arquivo mapeados
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (subfolderMap[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não suportado!'));
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});


export default upload;
