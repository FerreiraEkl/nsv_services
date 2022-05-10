import JsonWebToken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path'
import { IUser } from '../schemas/interfaces/IUser';
class JWT {
    private pathToKey = path.join(__dirname, '..', '..', process.env.SYSTEM_JWTKEY || '');
    private pubKey = fs.readFileSync(this.pathToKey, 'utf-8');

    createToken(user: IUser): any {
        const id = user.USU_USU;
        const expiresIn = '1d';

        const payload = {
            sub: id,
            iat: Date.now()
        }

        const signedToken = JsonWebToken.sign(payload, this.pubKey, {
            expiresIn: expiresIn,
            algorithm: 'RS256'
        });

        return {
            token: 'Bearer ' + signedToken,
            expires: expiresIn
        }
    }
}

export default new JWT();