import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { IUser } from '../schemas/interfaces/IUser';

const publicStorage = multer.diskStorage({
    destination: (req, file, done) => {
        var user = <IUser>JSON.parse(JSON.stringify(req.user));
        var customerDir = "";
        customerDir = 'undefinedCustomer';

        var dir = path.resolve(__dirname, '../data', 'publico', customerDir, req.params.order, req.params.id);

        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);

        return done(null, dir);
    },
    filename: (req, file, done) => {
        crypto.randomBytes(16, (err, hash) => {
            if (err)
                return done(err, '');

            const fileExt = file.originalname.split('.');

            file.originalname = `${hash.toString("hex")}.${fileExt[fileExt.length - 1]}`;
            return done(null, file.originalname);
        });
    }
});

const privateStorage = multer.diskStorage({
    destination: (req, file, done) => {

        const user = <IUser>JSON.parse(JSON.stringify(req.user));
        const customerDir = 'undefined';
        const order = (req.params.order) ? req.params.order : 'undefined';
        const item = (req.params.item) ? req.params.item : 'undefined';
        const dir = path.resolve(__dirname, '../data', 'private', `customer_${customerDir}`, `order_${order}`, `item_${item}`);

        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });

        return done(null, dir);
    },
    filename: (req, file, done) => {
        crypto.randomBytes(16, (err, hash) => {
            if (err)
                return done(err, '');

            const fileExt = file.originalname.split('.');

            file.originalname = `${hash.toString("hex")}.${fileExt[fileExt.length - 1]}`;
            return done(null, file.originalname);
        });
    }
});

const upload = {
    public: multer({ storage: publicStorage }),
    private: multer({ storage: privateStorage }),
};

export default upload;