const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/mongoose-connection'); 
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());



// Middleware
app.use(cors({
  origin: "*",      // Allow all origins
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(cors({
  origin: "https://sandalista-864466213133.us-central1.run.app/",
  credentials: true
}));

// const allowedOrigins = [
//     "*",
//   "https://sandalista-864466213133.us-central1.run.app",
//   "http://localhost:5173"
// ];
// const corsOptions = {
//     origin: (origin, callback) => {
//        if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, origin || true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true, // allow cookies/authorization headers
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//     optionsSuccessStatus: 204
// };

// app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic routes
app.get('/', (req, res) => {
    res.json({ message: 'King Footwear Backend running' });
});
app.use('/', require('./Routers/userRouter'));
app.use('/admin', require('./Routers/adminRouter'));
app.use('/product', require('./Routers/productRouter'));
app.use('/payment', require('./Routers/paymentRouter'));
app.use('/delivery', require('./Routers/deliveryRouter'));
app.use('/mail', require('./Routers/emailRouter'));
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});



const PORT = process.env.PORT ;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

