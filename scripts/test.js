import ServerAPI from "./server_api.js";

document.getElementById("login").onclick = (event) => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    ServerAPI.loginUser(email, password, response => {
        console.log(response);
        if (response.status === 404) {
            console.log(response.msg);
        } else if (response.status === 200) {
            alert("LOGGED IN");
        }
    });
};