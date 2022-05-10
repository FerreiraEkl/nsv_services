import { ExtractJwt, Strategy } from 'passport-jwt';
import fs from 'fs';
import path from 'path'
import { User } from '../schemas/tableSchemas/userSchema'

const pathToKey = path.join(__dirname, '..', '..', process.env.SYSTEM_JWTKEY || '');
const pubKey = fs.readFileSync(pathToKey, 'utf-8');

const passportJWTOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: pubKey,
    algorithms: ['RS256']
}

const jwtStrategy = new Strategy(passportJWTOptions, (payload, done) => {
    User.findOne({
        where: {
            USU_USU: payload.sub
        }
    }).then(user => {
        if (!user)
            return done(null, false, { message: "Usuário ou senha incorretas!" });

        return done(null, user);

    }).catch(err => {
        done(err, null);
    });
});

module.exports = (passport: any) => {
    passport.use(jwtStrategy);
}