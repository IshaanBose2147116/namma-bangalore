$(document).ready(() => {
    if (sessionStorage.getItem("name") !== null) {
        document.getElementById("user-name").innerText = "Welcome " + sessionStorage.getItem("name") + "!";

        if (sessionStorage.getItem("isadmin") === "true") {
            console.log("heere");
            document.getElementById("user-name").innerHTML += ` <a href="http://localhost:5000/admin/${ sessionStorage.getItem("uid") }">Go to admin page.</a>`;
        }

        document.getElementById("login-link").innerText = "Logout";
        document.getElementById("login-link").href = "#";
        document.getElementById("login-link").onclick = function() {
            sessionStorage.removeItem("name");
            sessionStorage.removeItem("uid");
            location.reload();
        };
        
    } else {
        document.getElementById("user-name").innerText = "";
        document.getElementById("login-link").innerText = "Login";
        document.getElementById("login-link").href = "/login";
    }
});