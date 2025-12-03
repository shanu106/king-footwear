const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/mongoose-connection'); 
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());



// Middleware
const corsOptions = {
    origin: (origin, callback) => callback(null, origin || true), // reflect request origin
    credentials: true, // allow cookies/authorization headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
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

