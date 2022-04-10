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
     *          } else {
     *              console.log("Failed to register");
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
     *          } else {
     *              console.log("Failed to register");
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
     * @param {string} email email of user trying to login
     * @param {string} password password of user trying to login
     * @param {responseCallback} callback function that receives response
     * @example
     * ServerAPI.loginUser(email, password, response => {
     *      if (response.status === 404) {
     *          console.log(response.msg);
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
    static loginUser(email, password, callback) {
        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response => {
            if (response.status === 404) {
                response.json().then(data => {
                    callback({ status: 404, msg: data.msg });
                });
            } else if (response.status === 500) {
                callback(response);
            } else {
                callback({ status: 200, msg: "OK" });
            }
        })
    }
}

export default ServerAPI;