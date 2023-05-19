import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//before multer instance, need to configure where files will be storage
const storage = multer.diskStorage({
  //destination: folder were image will be saved
  destination: function (req, file, cb) {
    cb(null, __dirname + '/public/img');
  },
  //filename: name of file
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
