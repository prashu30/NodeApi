const mongoose = require('mongoose');
const url = require('./keys').mongoUri;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => console.log('Connected!'))
    .catch(err => console.log(err));