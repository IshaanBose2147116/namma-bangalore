const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'namma-bangalore'
});

app.use(bodyParser.json());

app.use("/styles", express.static(path.join(__dirname, '../styles')));
app.use("/scripts", express.static(path.join(__dirname, '../scripts')));
app.use("/assests", express.static(path.join(__dirname, '../assests')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${ PORT }`);
    console.log(`Visit: http://localhost:${ PORT }`)
});