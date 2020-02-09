const  express = require('express');
require('dotenv');

const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('listening at : ' +port));
app.use('/', express.static(__dirname + '/'));
app.use(express.json({limit : '1mb'}));

