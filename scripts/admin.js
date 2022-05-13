const tableHeader = {
    hotel:
        `<th>Hotel ID</th>
        <th>Name</th>
        <th>Address Line 1</th>
        <th>Address Line 2</th>
        <th>Address Line 3</th>
        <th>Pincode</th>
        <th>Highest Price</th>
        <th>Lowest Price</th>
        <th></th>`,
    vehicle:
        `<th>Vehicle ID</th>
        <th>License Plate</th>
        <th>Colour</th>
        <th>Type</th>
        <th>Driver ID</th>
        <th></th>`,
    driver:
        `<th>Driver ID</th>
        <th>First Name</th>
        <th>Middle Name</th>
        <th>Last Name</th>
        <th>Phone Number</th>
        <th>License Number</th>
        <th></th>`,
    tourist_spot:
        `<th>ID</th>
        <th>Name</th>
        <th>Address Line 1</th>
        <th>Address Line 2</th>
        <th>Address Line 3</th>
        <th>Pincode</th>
        <th>Description</th>
        <th>Opening Time</th>
        <th>Closing Time</th>
        <th></th>`,
    feedback:
        `<th>Feedback ID</th>
        <th>Comment</th>
        <th>Rating</th>
        <th>Given By</th>
        <th>Feedback For</th>
        <th>Given On</th>
        <th>Feedback On</th>
        <th></th>`,
    user:
        `<th>UID</th>
        <th>Email</th>
        <th>Phone Number</th>
        <th>Password</th>
        <th>Salt Value</th>
        <th></th>`,
    general_user:
        `<th>UID</th>
        <th>First Name</th>
        <th>Middle Name</th>
        <th>Last Name</th>
        <th>Is Admin?</th>
        <th></th>`,
    local_business:
        `<th>UID</th>
        <th>Address Line 1</th>
        <th>Address Line 2</th>
        <th>Address Line 3</th>
        <th>Pincode</th>
        <th>Business Name</th>
        <th>Aadhaar Number</th>
        <th></th>`,
    vehicle_booking:
        `<th>Booking ID</th>
        <th>Booked By</th>
        <th>From Date</th>
        <th>Till Date</th>
        <th>Vehicle ID</th>
        <th></th>`,
    lb_certificate:
        `<th>UID</th>
        <th>Certificate</th>
        <th>Is Verified?</th>
        <th>Verified By</th>
        <th></th>`,
    job_posting:
        `<th>Posted By</th>
        <th>Posted On</th>
        <th>Job Title</th>
        <th>Description</th>
        <th>Experience</th>
        <th>Salary</th>
        <th>Starts By</th>
        <th>Ends By</th>
        <th></th>`
};

// only needed for tables where data can be added by the admin
const tableCols = {
    hotel: [ "hotel_id", "name", "address_line1", "address_line2", "address_line3", "pincode", 'highest_price', 
        "lowest_price" ],
    vehicle: [ "vehicle_id", "license_plate", "colour", "type", "driver_id" ],
    driver: [ "driver_id", "fname", "mname", "lname", "phone_num", "license_num" ],
    tourist_spot: [ "id", "name", "address_line1", "address_line2", "address_line3", "pincode", 'description', 
    "opening_time", "closing_time" ],
    user: [ "uid", "email", "phone_num", "password", "salt_value" ],
    general_user: [ "uid", "fname", "mname", "lname", "is_admin" ],
    local_business: [ "uid", "address_line1", "address_line2", "address_line3", "pincode", "business_name", "aadhaar_num" ],
    vehicle_booking: [ "booking_id", "booked_by", "from_date", "till_date", "vehicle_id" ]
}

// for tables where admin shouldn't be able to edit values
const excludeEdit = [ "feedback" ];

let currentTableData = undefined;

$(document).ready(() => {
    if (sessionStorage.getItem("name") === null) {
        alert("Access denied, not logged in!");
        window.open("http://localhost:5000", "_self");

        return;
    }

    console.log(Object.keys(tableCols));

    $("#logout").click(() => {
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("uid");
        window.open("/", "_self");
    });

    $("#admin-name").text(`${ sessionStorage.getItem("name") }!`);
    $(".action-button").click(showAddPopup);
    
    displayTableHeader("user");

    $(".popup-container").on('click', '#close-popup', () => {
        $(".popup-container").hide();
    });

    $(".menu").on('click', '.menu-item', (evt) => {
        console.log(evt);
        const menuItems = document.getElementsByClassName("menu-item");

        for (let i = 0; i < menuItems.length; i++) {
            menuItems[i].className = "menu-item";
        }

        evt.target.className = "menu-item selected";

        if (Object.keys(tableCols).includes(evt.target.id)) {
            $(".table-actions").show();
        } else {
            $(".table-actions").hide();
        }

        displayTableHeader(evt.target.id);
    });
});

function displayTableHeader(id) {
    const thead = document.getElementsByTagName("thead")[0];
    thead.innerHTML = `<tr>${ tableHeader[id] }</tr>`

    getDataFrom(id);
}

function getDataFrom(table) {
    fetch(`http://localhost:5000/get/${ table }`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        response.json().then(data => {
            currentTableData = data;
            currentTableData.currentTable = table;
            displayData(data);
        })
    });
}

function displayData(data) {
    const tbody = document.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        let saveIndex = true;
        var row = '<tr>';

        for (let key in data[i]) {
            if (saveIndex)
                saveIndex = false;

            row += `<td>${ data[i][key] }</td>`;
        }

        if (excludeEdit.includes(currentTableData.currentTable)) {
            row += `
            <td>
                <span class="material-icons clickable-icon delete" id="delete-${ i }">delete</span>
            </td>
            </tr>`;
        } else {
            row += `
            <td>
                <span class="material-icons clickable-icon edit" id="edit-${ i }">edit</span>
                <span class="material-icons clickable-icon delete" id="delete-${ i }">delete</span>
            </td>
            </tr>`;
        }

        $(document).off('click', `#edit-${ i }`, showEditPopup);
        $(document).off('click', `#delete-${ i }`, deleteRow);

        $(document).on('click', `#edit-${ i }`, showEditPopup);
        $(document).on('click', `#delete-${ i }`, deleteRow);

        tbody.innerHTML += row;
    }
}

function deleteRow(evt) {
    console.log(evt.currentTarget.id);
    const row = currentTableData[evt.currentTarget.id.split('-')[1]];

    fetch(`http://localhost:5000/delete/${ currentTableData.currentTable }/${ Object.keys(row)[0] }/${ row[Object.keys(row)[0]] }`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        if (response.status === 200) {
            getDataFrom(currentTableData.currentTable);
        } else {
            response.json().then(data => {
                alert("Could not delete, check console or server for error.");
                console.log(data);
            });
        }
    });
}

function showEditPopup(evt) {
    $(".popup-container").css("display", "flex");

    let rowData = currentTableData[evt.currentTarget.id.split('-')[1]];
    const popup = document.querySelector(".popup");
    popup.innerHTML = `
    <div class="popup-title">
        <span>Edit</span>
        <button id="close-popup"><span class="material-icons">close</span></button>
    </div>
    <div class="popup-fields">
    `;

    var id = null;

    for (let key in rowData) {
        if (id === null) {
            id = key;
        }

        if (key === 'password' || key === 'salt_value') {
            document.querySelector(".popup-fields").innerHTML += `
            <div>
                ${ key }: <input type="text" id="${ key }" value="${ rowData[key] }" readonly="true" />
            </div>
            `;    
        } else {
            document.querySelector(".popup-fields").innerHTML += `
            <div>
                ${ key }: <input type="text" id="${ key }" value="${ rowData[key] }" />
            </div>
            `;
        }
    }

    document.querySelector(".popup-fields").innerHTML += `<button class="action-button" id=${ rowData[id] }>Save</button>`;

    popup.innerHTML += '</div>';

    $(".popup-container").on('click', '.action-button', evt => {
        saveEdit(evt, rowData);
    });
}

function showAddPopup() {
    $(".popup-container").css("display", "flex");

    const popup = document.querySelector(".popup");
    popup.innerHTML = `
    <div class="popup-title">
        <span>Add</span>
        <button id="close-popup"><span class="material-icons">close</span></button>
    </div>
    <div class="popup-fields">
    `;

    for (let i = 0; i < tableCols[currentTableData.currentTable].length; i++) {
        document.querySelector(".popup-fields").innerHTML += `
        <div>
            ${ tableCols[currentTableData.currentTable][i] }: <input type="text" id="${ tableCols[currentTableData.currentTable][i] }"/>
        </div>
        `;
    }

    document.querySelector(".popup-fields").innerHTML += `<button class="action-button">Save</button>`;

    popup.innerHTML += '</div>';

    $(".popup-container").on('click', '.action-button', addData);
}

function saveEdit(evt, rowData) {
    var bodyData = {};

    for (let key in rowData) {
        bodyData[key] = document.getElementById(key).value.length === 0 ? null : document.getElementById(key).value;
    }

    fetch(`http://localhost:5000/update/${ currentTableData.currentTable }/${ evt.currentTarget.id }`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
    }).then(response => {
        if (response.status === 200) {
            $(".popup-container").hide();
            getDataFrom(currentTableData.currentTable);
        } else {
            console.log(response);
        }
    });
}

function addData() {
    var bodyData = {};

    for (let i = 0; i < tableCols[currentTableData.currentTable].length; i++) {
        var key = tableCols[currentTableData.currentTable][i];
        bodyData[key] = document.getElementById(key).value.length === 0 ? null : document.getElementById(key).value;
    }

    console.log(currentTableData.currentTable);
    fetch(`http://localhost:5000/add/${ currentTableData.currentTable }`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
    }).then(response => {
        if (response.status === 200) {
            $(".popup-container").hide();
            getDataFrom(currentTableData.currentTable);
        } else if (response.status === 400) {
            response.json().then(data => alert(data));
        } else {
            alert("Internal Server Error");
            response.json().then(data => console.log(data));
        }
    });
}