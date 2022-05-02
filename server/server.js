const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});  

const app = express();
const PORT = 5000;
const MIN_UID = 1;
const MAX_UID = 999999;
const dbDetailsPath = './db_details.json';

<<<<<<< HEAD
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Logeshn009',
    database: 'namma_bangalore'
});
=======
let conn = null;
>>>>>>> f24761b09ed7a304c50263dec61d3314e7aa7f9d

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
.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, '../registration.html'));
})
.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
})
.get('/tourism', (req, res) => {
    res.sendFile(path.join(__dirname, '../tourism.html'));
})
.get('/vehicle-booking', (req, res) => {
    res.sendFile(path.join(__dirname, '../vehicle_booking.html'));
})
.get('/hotels', (req, res) => {
    res.sendFile(path.join(__dirname, '../hotels.html'));
})
.post('/register-user/:type', (req, res) => {
    conn.connect((err) => {
        if (err) {
            console.log(err);
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
                                        
                                        if (err.code === 'ER_DUP_ENTRY') {
                                            if (err.sqlMessage.includes('user.email')) {
                                                res.status(400).send({ msg: 'Duplicate email', errCode: 1000 });
                                            } else {
                                                res.status(400).send({ msg: 'Duplicate phone number', errCode: 1001 });
                                            }
                                        } else {
                                            console.log(err);
                                            res.status(500).send(err);
                                        }
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
.post("/login-email", (req, res) => {
    conn.connect(err => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            conn.query(`select password, salt_value from user where email="${ req.body.email }"`, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    if (result.length === 0) {
                        res.status(404).send({ msg: "Invalid email", errCode: 1010 });
                    } else {
                        crypto.scrypt(req.body.password, result[0].salt_value, 32, (err, derivedKey) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send(err);
                            } else {
                                if (result[0].password === derivedKey.toString('base64')) {
                                    res.sendStatus(200);
                                } else {
                                    res.status(404).send({ msg: "Incorrect password", errCode: 1011 });
                                }
                            }
                        });
                    }
                }
            });
        }
    });
})
.post('/login-phone', (req, res) => {
    conn.connect(err => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            conn.query(`select uid, password, salt_value from user where phone_num="${ req.body.phonenum }"`, (err, result) => {
                const uid = result[0].uid;

                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    if (result.length === 0) {
                        res.status(404).send({ msg: "Invalid phone number", errCode: 1012 });
                    } else {
                        crypto.scrypt(req.body.password, result[0].salt_value, 32, (err, derivedKey) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send(err);
                            } else {
                                if (result[0].password === derivedKey.toString('base64')) {
                                    conn.query('select fname, mname, lname from general_user where uid=?', uid, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).send(err);
                                        } else {
                                            if (result.length === 0) {
                                                conn.query('select business_name from local_business where uid=?', uid, (err, result) => {
                                                    if (err) {
                                                        console.log(err);
                                                        res.status(500).send(err);
                                                    } else {
                                                        res.status(200).send({ uid: uid, name: result[0].business_name });
                                                    }
                                                });
                                            } else {
                                                var name = result[0].fname;

                                                if (result[0].mname !== "null") {
                                                    name = name.concat(" ", result[0].mname);
                                                }

                                                if (result[0].lname !== "null") {
                                                    name = name.concat(" ", result[0].lname);
                                                }
                                                
                                                res.status(200).send({ uid: uid, name: name });
                                            }
                                        }
                                    });
                                } else {
                                    res.status(404).send({ msg: "Incorrect password", errCode: 1011 });
                                }
                            }
                        });
                    }
                }
            });
        }
    });
})
.get('/available-vehicles', (req, res) => {
    if (Object.keys(req.query).length < 2) {
        res.status(400).send({ 
            msg: "Query string must contain at least 2 arguments." ,
            errCode: 2000
        });
    } else if (Object.keys(req.query).length > 3) {
        res.status(400).send({ 
            msg: "Query string cannot have more than 3 arguments." ,
            errCode: 2001
        });
    } else {
        if (req.query.from_time === undefined || req.query.to_time === undefined) {
            res.status(400).send({ 
                msg: "Invalid arguments passed! Arguments allowed: 'from_time' (required), 'to_time' (required), and 'type'." ,
                errCode: 2002
            });
        } else {
            var query;

            if (req.query.type === undefined) {
                query = 
                    `select v.vehicle_id, v.license_plate, v.colour, v.type, 
                    concat_ws(' ', d.fname, d.mname, d.lname) as driver_name, d.phone_num from vehicle v join driver d 
                    on v.driver_id=d.driver_id where v.vehicle_id not in 
                    (select b.vehicle_id from vehicle_booking b where b.from_date <= ? and b.till_date >= ?)`;
            } else {
                query = 
                    `select v.vehicle_id, v.license_plate, v.colour, v.type, 
                    concat_ws(' ', d.fname, d.mname, d.lname) as driver_name, d.phone_num from vehicle v join driver d 
                    on v.driver_id=d.driver_id where v.vehicle_id not in 
                    (select b.vehicle_id from vehicle_booking b where b.from_date <= ? and b.till_date >= ?) and type = ?`;
            }

            conn.connect((err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    var filters = [ req.query.to_time, req.query.from_time ];
                    
                    if (req.query.type !== undefined)
                        filters.push(req.query.type);
                    
                    conn.query(query, filters, (err, result) => {
                        if (err) {
                            if (err.errno === 1525) {
                                res.status(400).send({
                                    msg: err.sqlMessage,
                                    errCode: 1020
                                });
                            } else {
                                console.log(err);
                                res.status(500).send(err);
                            }
                        } else {
                            var resResults = [];
                            console.log(result);

                            for (var i = 0; i < result.length; i++) {
                                resResults.push({
                                    vehicle_details: {
                                        vehicle_id: result[i].vehicle_id,
                                        license_plate: result[i].license_plate,
                                        colour: result[i].colour,
                                        type: result[i].type
                                    },
                                    driver_details: {
                                        name: result[i].driver_name,
                                        phone: result[i].phone_num
                                    }
                                });
                            }

                            res.status(200).send(resResults);
                        }
                    });
                }
            });
        }
    }
})
.post('/book-vehicle', (req, res) => {
    conn.connect((err) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            conn.query('select vehicle_id from vehicle where license_plate=?', req.body.license_plate, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    if (result.length === 0) {
                        res.status(400).send({ msg: "License plate not registered", errCode: 1030 });
                    } else {
                        const vehicleID = result[0].vehicle_id;
    
                        conn.query('insert into vehicle_booking values (default, ?, ?, ?, ?)', 
                            [ req.body.booked_by, req.body.from_date, req.body.till_date, vehicleID ], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send(err);
                                } else {
                                    res.sendStatus(200);
                                }
                        });
                    }
                }
            });
        }
    });
});

function main() {
    if (fs.existsSync(dbDetailsPath)) {
        conn = mysql.createConnection(JSON.parse(fs.readFileSync(dbDetailsPath, 'utf8')));

        app.listen(PORT, () => {
            console.log(`Visit: http://localhost:${PORT}`);
        });
    } else {
        readline.question('Enter db password: ', password => {
            var dbDetails = {
                host: 'localhost',
                user: 'root',
                password: password,
                database: 'namma_bangalore'
            }

            readline.close();

            fs.writeFileSync(dbDetailsPath, JSON.stringify(dbDetails, null, 4), 'utf8', () => {
                main();
            });
        });
    }
}

main();