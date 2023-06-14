import * as url from 'url';
import bcrypt from 'bcrypt';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


//BCRYPT

const createHash = (pass) => {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
};

const isValidPass = (passDb, pass) => {
    return bcrypt.compareSync(passDb, pass);
};

export { __filename, __dirname, createHash, isValidPass };