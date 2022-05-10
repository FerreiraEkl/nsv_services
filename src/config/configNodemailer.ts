import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.NODEMAIL_HOST || '',
    secure: false, // true for 465, false for other ports
    port: parseInt(process.env.NODEMAIL_PORT || ''),    
    tls: { rejectUnauthorized: false }
});

export default transporter;