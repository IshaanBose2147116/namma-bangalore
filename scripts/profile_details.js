let hashMap = {};

function id(id) {
    return document.getElementById(id);
}

const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

function validateBusinessName() {
    if (id("business_name").value.length === 0) {
        $("#bname-err").text("Business name cannot be empty.");
        return false;
    }

    $("#bname-err").text("");
    return true;
}

function validateAddress1() {
    if (id("add-line-1").value.length === 0) {
        $("#add-err").text("Address line 1 cannot be empty.");
        return true;
    }

    $("#add-err").text("");
    return true;
}

function validatePincode() {
    if (id("pincode").value.length !== 6) {
        $("#pincode-err").text("Pincode has to be 6 digits long.");
        return false;
    }

    $("#pincode-err").text("");
    return true;
}

function validateAadhaar() {
    if (id("aadhaar").value.length !== 12) {
        $("#aadhaar-err").text("Aadhaar number has to 12 digits long.");
        return false;
    }

    $("#aadhaar-err").text("");
    return true;
}

function onlyNumbers(evt) {
    if ((evt.which > 58 || evt.which < 47) && evt.key !== 'Backspace') {
        evt.preventDefault();
    }
}

$(document).ready(() => {
    if (sessionStorage.getItem("name") === null || sessionStorage.getItem("isbusiness") === null) { 
        window.open("/", "_self");
    }

    id("business_name").onkeyup = validateBusinessName;
    id("add-line-1").onkeyup = validateAddress1;
    id("pincode").onkeyup = validatePincode;
    id("aadhaar").onkeyup = validateAadhaar;

    id("pincode").onkeydown = onlyNumbers;
    id("aadhaar").onkeydown = onlyNumbers;

    fetch(`http://localhost:5000/get-business-details/${ sessionStorage.getItem("uid") }`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.status === 200) {
            response.json().then(data => {
                console.log(data);
                id("business_name").value = data.business_name;
                id("add-line-1").value = data.address_line1;
                id("add-line-2").value = data.address_line2;
                id("add-line-3").value = data.address_line3;
                id("pincode").value = data.pincode;
                id("aadhaar").value = data.aadhaar_num;

                $("#save-changes").click(saveChanges);
                $("#upload-cert").click(uploadCertificate);

                getCertificates();
            });
        } else {
            alert("Could not retrieve details, try again later.");
        }
    });
});

function saveChanges() {
    if (validateBusinessName() && validateAddress1() && validateAadhaar() && validatePincode()) {
        var data = {
            address_line1: id("add-line-1").value,
            address_line2: id("add-line-2").value,
            address_line3: id("add-line-3").value,
            pincode: id("pincode").value,
            business_name: id("business_name").value,
            aadhaar_num: id("aadhaar").value
        }
    
        fetch(`http://localhost:5000/update/local_business/${ sessionStorage.getItem("uid") }`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                sessionStorage.setItem("name", id("business_name").value);
                location.reload();
            } else {
                response.json().then(data => console.log(data));
            }
        });
    }

}

function uploadCertificate() {
    const files = id("upload-certificate").files;
    const formData = new FormData();
    formData.append('img', files[0]);

    fetch(`http://localhost:5000/save-certificate/${ sessionStorage.getItem("uid") }`, {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.status === 200) {
            alert("Uploaded successfully");
            location.reload();
        }
        else {
            alert("Could not upload");
        }
    });
}

function getCertificates() {
    fetch(`http://localhost:5000/get-certificates/${ sessionStorage.getItem("uid") }`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.status === 200) {
            response.json().then(data => {
                for (let i = 0; i < data.certificates.length; i++) {
                    hashMap[cyrb53(data.absolute[i])] = data.absolute[i];

                    id("certificate-container").innerHTML += 
                        `<div>
                            <a href="${ data.certificates[i].link }" target="_blank">Certificate ${ i + 1 }</a>
                            ${ data.certificates[i].isVerified ? 
                                "<span class='material-icons' style='color: green;'>done</span>" : "" }
                            <span id="${ cyrb53(data.absolute[i]) }" class="material-icons delete">delete</span>
                        </div>`;
                    
                    $(document).on('click', `#${ cyrb53(data.absolute[i]) }`, deleteCertificate);
                }

                id("certificate-container").innerHTML += '<input type="file" accept="image/*" id="upload-certificate" />';
            });
        }
    });
}

function deleteCertificate(evt) {
    console.log(hashMap[evt.currentTarget.id]);
    fetch(`http://localhost:5000/delete-certificate`, {
        method: 'DELETE',
        headers: { "Content-Type": "text/plain" },
        body: hashMap[evt.currentTarget.id]
    }).then(response => {
        if (response.status === 200) {
            location.reload();
        } else {
            alert("Could not delete, try again.");
        }
    });
}