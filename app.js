const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

// DB connect
require('./model/connectivity');

const indexRouter = require('./routes/index');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use('/users', indexRouter);

const PORT = 3000;
app.listen(PORT, console.log(`App running on: ${PORT}`));