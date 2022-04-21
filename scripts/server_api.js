/**
 * Class containing functions to interact with the web server.
 * To use this class: `import ServerAPI from "./server_api";`
 */
class ServerAPI {
    /**
     * Registers user as a general user.
     * 
     * @param {string} email (required)
     * @param {string} password (required)
     * @param {string} phoneNum (required)
     * @param {string} fname (required)
     * @param {string} mname (can be null)
     * @param {string} lname (can be null)
     * @param {boolean} isAdmin true if user is admin, false if not
     * @param {function} callback function that receives response
     * @example
     * ServerAPI.registerGeneralUser(
     *     "test@test.com", "password", "1234567890", "First", null, "Last", false, response => {
     *          if (response.status === 200) {
     *              console.log("Successfully registered");
     *          } else if (response.status === 400) {
     *              if (response.errCode === 1000) {
     *                  alert("Duplicate email");
     *              } else {
     *                  alert("Duplicate phone number");
     *              }
     *          } else {
     *              console.log(response);
     *          }
     *      }
     * )
     */
    static registerGeneralUser(email, password, phoneNum, fname, mname, lname, isAdmin, callback) {
        fetch("http://localhost:5000/register-user/general", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
                phone_num: phoneNum,
                fname: fname,
                mname: mname,
                lname: lname,
                is_admin: isAdmin
            })
        }).then(response => {
            callback(response);
        });
    }

    /**
     * Registers user as a local business.
     * 
     * @param {string} email (required)
     * @param {string} password (required)
     * @param {string} phoneNum (required)
     * @param {string} addressLine1 (required)
     * @param {string} addressLine2 (can be null)
     * @param {string} addressLine3 (can be null)
     * @param {string} pincode (required)
     * @param {string} businessName (required)
     * @param {string} aadhaarNum (required)
     * @param {function} callback function that receives response
     * @example
     * ServerAPI.registerLocalBusiness(
     *     "test@test.com", "password", "1234567890", "Address1", "Address2", null, "400051", "Business", "111111111111", response => {
     *          if (response.status === 200) {
     *              console.log("Successfully registered");
     *          } else if (response.status === 400) {
     *              if (response.errCode === 1000) {
     *                  alert("Duplicate email");
     *              } else {
     *                  alert("Duplicate phone number");
     *              }
     *          } else {
     *              console.log(response);
     *          }
     *      }
     * )
     */
    static registerLocalBusiness(email, password, phoneNum, addressLine1, addressLine2, 
        addressLine3, pincode, businessName, aadhaarNum, callback) {
        fetch("http://localhost:5000/register-user/local-business", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
                phone_num: phoneNum,
                address_line1: addressLine1,
                address_line2: addressLine2,
                address_line3: addressLine3,
                pincode: pincode,
                business_name: businessName,
                aadhaar_num: aadhaarNum
            })
        }).then(response => {
            callback(response);
        });
    }

    /**
     * Checks if user exists in database and if user credentials are correct.
     * 
     * @param {string} key email/phone number of user trying to login
     * @param {string} password password of user trying to login
     * @param {boolean} isEmail if key is email true, else false
     * @param {responseCallback} callback function that receives response
     * @example
     * ServerAPI.loginUser(email, password, true, response => {
     *      if (response.status === 404) {
     *          if (response.errCode === 1010)
     *              console.log("Invalid email.");
     *          else if (response.errCode === 1012)
     *              console.log("Invalid phone number.");
     *          else
     *              console.log("Invalid password.");
     * 
     *          console.log(response.msg); // contains message describing cause of status code
     *      } else if (response.status === 200) {
     *          alert("LOGGED IN");
     *      } else {
     *          console.log(response); // internal server error
     *      }
     * });
     * 
     * @callback responseCallback
     * @param {object} response contains members: status and msg or is of type mysql.QueryError or Error
     */
    static loginUser(key, password, isEmail, callback) {
        if (isEmail) {
            fetch("http://localhost:5000/login-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: key,
                    password: password
                })
            }).then(response => {
                if (response.status === 404) {
                    response.json().then(data => {
                        callback({ status: 404, msg: data.msg, errCode: data.errCode });
                    });
                } else if (response.status === 500) {
                    callback(response);
                } else {
                    callback({ status: 200, msg: "OK" });
                }
            });
        } else {
            fetch("http://localhost:5000/login-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phonenum: key,
                    password: password
                })
            }).then(response => {
                if (response.status === 404) {
                    response.json().then(data => {
                        callback({ status: 404, msg: data.msg, errCode: data.errCode });
                    });
                } else if (response.status === 500) {
                    callback(response);
                } else {
                    callback({ status: 200, msg: "OK" });
                }
            })
        }
        
    }
}

export default ServerAPI;