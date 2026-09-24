const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const dns = require('dns');

// Force Node.js to prefer IPv4 over IPv6 to fix ENETUNREACH errors on Render.com
dns.setDefaultResultOrder('ipv4first');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

/**
 * EMAIL CONFIGURATION
 * Updated to use explicit SMTP settings to avoid ENETUNREACH errors on Render.com
 */
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER, // Your gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
});

/**
 * ROUTE: Book a Demo (Contact Form)
 */
app.post('/book-demo', async (req, res) => {
    const { name, email, bookTitle, genre, synopsis, heardAbout } = req.body;

    // Simple server-side validation
    if (!name || !email || !bookTitle) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Sending the notification to yourself
        subject: `🚀 New Demo Request: ${bookTitle}`,
        text: `
            You have a new demo request from Quillora!

            Author Name: ${name}
            Email: ${email}
            Book Title: ${bookTitle}
            Genre: ${genre}
            Synopsis: ${synopsis}
            Heard About Us: ${heardAbout}
        `,
        html: `
            <h3>New Quillora Demo Request</h3>
            <p><strong>Author:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Book:</strong> ${bookTitle}</p>
            <p><strong>Genre:</strong> ${genre}</p>
            <p><strong>Synopsis:</strong> ${synopsis}</p>
            <p><strong>Referral:</strong> ${heardAbout}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Success! Demo request sent.' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

/**
 * ROUTE: Partnership Enquiry (Tie-ups Form)
 */
app.post('/partnership-enquiry', async (req, res) => {
    const { name, organisation, partnerType, message } = req.body;

    if (!name || !organisation) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `🤝 New Partnership: ${partnerType} - ${organisation}`,
        text: `
            New Partnership Enquiry:
            Name: ${name}
            Organisation: ${organisation}
            Type: ${partnerType}
            Message: ${message}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Success! Partnership enquiry sent.' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

app.listen(PORT, () => {
    console.log(`
    =========================================
    🚀 Quillora Server is running!
    🌐 Local URL: http://localhost:${PORT}
    📧 Monitoring emails from: ${process.env.EMAIL_USER}
    =========================================
    `);
});
