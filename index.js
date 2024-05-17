const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.post('/api/send-email', async (req, res) => {
    try {
        const { name, surname, email, question } = req.body;

        
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'vasilchenko.maksim374@gmail.com', 
                pass: 'rzgc mupw xzth csir' 
            }
        });

        
        let mailOptions = {
            from: 'vasilchenko.maksim374@gmail.com', 
            to: 'vasilchenko.maksim374@gmail.com', 
            subject: 'New Question from Contact Form', 
            text: `Name: ${name}\n Surname: ${surname}\nEmail: ${email}\nQuestion: ${question}` 
        };

        
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);

       
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Failed to send email: ', error);
        
        res.status(500).json({ message: 'Failed to send email' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
