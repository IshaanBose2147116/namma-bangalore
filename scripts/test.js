import ServerAPI from "./server_api.js";

document.getElementById("register").onclick = (event) => {
    var email = document.getElementById("email1").value;
    var password = document.getElementById("password1").value;
    var phone = document.getElementById("phone").value;
    var name = document.getElementById("name").value;

    name = name.trim();
    name += ' ';
    console.log(/^([a-zA-Z]+\s){2,3}$/.test(name));
    // var spaceCount = (name.match(/\s/g) || []).length

    // if (spaceCount > 2) {
    //     alert("No more than 3 names.");
    // }


    name = name.split(' ');
    console.log(name);

    if (name.length == 2) {
        name.splice(1, 0, null);
    }

    ServerAPI.registerGeneralUser(email, password, phone, name[0], name[1], name[2], false, function (response) {
        if (repsone.status === 200) {
            alert("REDIRECT");
        } else if (response.status === 404){
            // if (response.msg === 'Same email')
        }
    });
};

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