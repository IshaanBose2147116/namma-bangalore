const navLinks = {
    general: 
        `<li class="nav-item">
            <a class="nav-link" href="/#hotels">Hotels</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/#travel">Travel & Tourism</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/vehicle-booking">Book a Vehicle</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/#travel">Local Employment</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/#travel">Offers</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="login-link" href="/login">Login</a>
        </li>`,
    business:
        `<li class="nav-item">
            <a class="nav-link" href="/#hotels">Hotels</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/#travel">Travel & Tourism</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/#travel">Local Employment</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/#travel">Offers</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/#travel">Profile Details</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="login-link" href="/login">Login</a>
        </li>`
};

$(document).ready(() => {
    if (sessionStorage.getItem("isbusiness"))
        document.getElementById("nav-link-list").innerHTML += navLinks.business;
    else
        document.getElementById("nav-link-list").innerHTML += navLinks.general;
    
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
            sessionStorage.removeItem("isadmin");
            sessionStorage.removeItem("isbusiness");
            location.reload();
        };
        
    } else {
        document.getElementById("user-name").innerText = "";
        document.getElementById("login-link").innerText = "Login";
        document.getElementById("login-link").href = "/login";
    }
});