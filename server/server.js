const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const crypto = require('crypto');
const { send } = require('process');

const app = express();
const PORT = 5000;
const MIN_UID = 1;
const MAX_UID = 999999;

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'namma_bangalore'
});

/**
 * 
 * @param {mysql.RowDataPacket[]} resultSet 
 * @param {int} max 
 * @param {int} min 
 * @returns Array containing unique ID and a unique salt value
 */
function generateUniqueIDAndSalt(resultSet, max, min) {
    var id = Math.floor(Math.random() * (max - min + 1)) + min;
    var idArray = [], saltArray = [];

    for (var i = 0; i < resultSet.length; i++) {
        idArray.push(resultSet[i].uid);
        saltArray.push(resultSet[i].salt_value);
    }

    while (idArray.includes(id)) {
        id = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var salt = crypto.randomBytes(16).toString('base64');

    while (saltArray.includes(salt)) {
        salt = crypto.randomBytes(16).toString('base64');
    }

    return [ id, salt ];
}

function registerGeneral(conn, data, callback) {
    conn.query(`insert into general_user values (${ data.uid }, "${ data.fname }", 
        "${ data.mname }", "${ data.lname }", ${ data.is_admin ? 1 : 0 })`, (err, result) => {
            callback(err);
        });
}

function registerLocalBusiness(conn, data, callback) {
    conn.query(`insert into local_business values (${ data.uid }, "${ data.address_line1 }", "${ data.address_line2 }",
        "${ data.address_line3 }", "${ data.pincode }", "${ data.business_name }", "${ data.aadhaar_num }")`, (err, result) => {
            callback(err);
        });
}

app.use(bodyParser.json());

app.use("/styles", express.static(path.join(__dirname, '../styles')));
app.use("/scripts", express.static(path.join(__dirname, '../scripts')));
app.use("/assests", express.static(path.join(__dirname, '../assests')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
})
.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '../test.html'));
})
.post('/register-user/:type', (req, res) => {
    conn.connect((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            conn.query('select uid, salt_value from user', (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    const [ uid, salt ] = generateUniqueIDAndSalt(result, MAX_UID, MIN_UID);
                    
                    crypto.scrypt(req.body.password, salt, 32, (err, derivedKey) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            var password = derivedKey.toString('base64');
                            
                            conn.query(`insert into user values (${ uid }, "${ req.body.email }", "${ req.body.phone_num }",
                                "${ password }", "${ salt }")`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send(err);
                                    } else {
                                        req.body.uid = uid;

                                        if (req.params.type === 'general') {
                                            registerGeneral(conn, req.body, error => {
                                                if (error) {
                                                    console.log(error);
                                                    res.status(500).send(error);
                                                } else {
                                                    res.sendStatus(200);
                                                }
                                            });
                                        } else {
                                            registerLocalBusiness(conn, req.body, error => {
                                                if (error) {
                                                    console.log(error);
                                                    res.status(500).send(error);
                                                } else {
                                                    res.sendStatus(200);
                                                }
                                            });
                                        }
                                    }
                                });
                        }
                    });
                    
                }
            });
        }
    });
})
.post("/login", (req, res) => {
    conn.connect(err => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            conn.query(`select password, salt_value from user where email="${ req.body.email }"`, (err, result) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (result.length === 0) {
                        res.status(404).send({ msg: "Invalid email" });
                    } else {
                        crypto.scrypt(req.body.password, result[0].salt_value, 32, (err, derivedKey) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send(err);
                            } else {
                                if (result[0].password === derivedKey.toString('base64')) {
                                    res.sendStatus(200);
                                } else {
                                    res.status(404).send({ msg: "Incorrect password" });
                                }
                            }
                        });
                    }
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Visit: http://localhost:${ PORT }`);
    console.log("Remember to change MySQL username/password. Go to line 14 and 15.");
});