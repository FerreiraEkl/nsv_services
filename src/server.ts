import dotenv from 'dotenv';
dotenv.config();
import app from './app';

app.listen(process.env.CONF_PORT || 3000, () => {
    console.log(`App listen on port:${process.env.CONF_PORT || 3000}`);
})