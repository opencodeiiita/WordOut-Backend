const nodemailer = require('nodemailer'); 

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_KEY,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to mail server:', error);
    } else {
        console.log('Connected to mail server successfully');
    }
});

module.exports = transporter;