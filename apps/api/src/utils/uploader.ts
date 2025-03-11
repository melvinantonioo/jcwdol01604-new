import { Request } from "express";
import multer from "multer";
import { join } from "path";

//Destination Mau Kita simpan dimana
type DestinationCallback = (error: Error | null, destination: string) => void;
//Tipe Filenya apa 
type FileNameCallback = (error: Error | null, fileName: string) => void;

export const SingleUploader = (filePrefix: string, folderName?: string) => {
    const maxSize = 1 * 1024 * 1024;
    //dirname adalah direktori lengkap sampai folder API tempat lokasi penyimpanan 
    const defaultDir = join(__dirname, "../../public/");

    console.log(defaultDir);

    const storage = multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb: DestinationCallback
        ) => {
            //Kita Setting Mau simpan dimana 
            const destination = folderName ? defaultDir + folderName : defaultDir;

            //buat callback 
            cb(null, destination);
        },
        filename: (
            req: Request,
            file: Express.Multer.File,
            cb: FileNameCallback
        ) => {
            const originalNameParts = file.originalname.split(".");
            console.log(originalNameParts);

            const fileExtension = originalNameParts[originalNameParts.length - 1];
            const newFileName = filePrefix + Date.now() + "." + fileExtension;

            cb(null, newFileName);
        },
    });
    return multer({ storage: storage, limits: { fileSize: maxSize } }).single("file")
}