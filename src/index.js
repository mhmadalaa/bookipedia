require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const booksRouter = require('./routers/booksRouter');



const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    }),
);

//to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.log('unhandledRejection', error.message);
});

const url = process.env.DATABASE;
mongoose
    .connect(url)
    .then((con) => {
        console.log('DB connecting successful...');
    })
    .catch((err) => {
        console.log('DB connection ERROR!!');
        console.log(err);
    });




app.use('/', booksRouter);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json(
        {
            error: {
                message: err.message
            }
        })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
