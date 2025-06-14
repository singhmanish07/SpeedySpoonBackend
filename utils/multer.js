import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(__dirname, '../public/images');
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
export {upload}

