import ServerAPI from "./server_api.js";

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
    touristSpot:
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
        <th></th>`
};

let currentTableData = undefined;

$(document).ready(() => {
    $("#admin-name").text(`${ sessionStorage.getItem("name") }!`);
    
    displayTableHeader("hotels");

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

        displayTableHeader(evt.target.id);
    });
});

function displayTableHeader(id) {
    const thead = document.getElementsByTagName("thead")[0];

    switch (id) {
        case "hotels":
            thead.innerHTML = `<tr>${ tableHeader.hotel }</tr>`;
            break;
        case "vehicle":
            thead.innerHTML = `<tr>${ tableHeader.vehicle }</tr>`;
            break;
        case "driver":
            thead.innerHTML = `<tr>${ tableHeader.driver }</tr>`;
            break;
        case "tourist-spots":
            thead.innerHTML = `<tr>${ tableHeader.touristSpot }</tr>`;
            break;
        case "lb-certificates":
            thead.innerHTML = `<tr>${ tableHeader.hotel }</tr>`;
            break;
        case "feedback":
            thead.innerHTML = `<tr>${ tableHeader.feedback }</tr>`;
            break;
    }

    getDataFrom(id);
}

function getDataFrom(table) {
    switch (table) {
        case "hotels":
            ServerAPI.getHotels(response => {
                let data = response.data;
                currentTableData = data;
                currentTableData.currentTable = table;
                displayData(data);
            });
            break;
        case "vehicle":
            fetch('http://localhost:5000/get-vehicles', {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            }).then(response => {
                response.json().then(data => {
                    currentTableData = data;
                    currentTableData.currentTable = table;
                    displayData(data);
                })
            });
            break;
        case "driver":
            fetch('http://localhost:5000/get-drivers', {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            }).then(response => {
                response.json().then(data => {
                    currentTableData = data;
                    currentTableData.currentTable = table;
                    displayData(data);
                })
            });
            break;
        case "tourist-spots":
            fetch('http://localhost:5000/get-tourist-spots', {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            }).then(response => {
                response.json().then(data => {
                    currentTableData = data;
                    currentTableData.currentTable = table;
                    displayData(data);
                })
            });
            break;
        case "feedback":
            fetch('http://localhost:5000/get-feedback', {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            }).then(response => {
                response.json().then(data => {
                    currentTableData = data;
                    currentTableData.currentTable = table;
                    displayData(data);
                })
            });
            break;
    }
}

function displayData(data) {
    const tbody = document.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        let saveIndex = true;
        let id = null;
        var row = '<tr>';

        for (let key in data[i]) {
            if (saveIndex) {
                id = key;
                saveIndex = false;
            }

            row += `<td>${ data[i][key] }</td>`;
        }

        row += `
        <td>
            <span class="material-icons clickable-icon edit" id="edit-${ i }">edit</span>
            <span class="material-icons clickable-icon delete" id="delete-${ i }">delete</span>
        </td>
        </tr>`;

        $(document).on('click', `#edit-${ i }`, (evt) => {
            showEditPopup(evt);
        });

        tbody.innerHTML += row;
    }
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

        document.querySelector(".popup-fields").innerHTML += `
        <div>
            ${ key }: <input type="text" id="${ key }" value="${ rowData[key] }" />
        </div>
        `;
    }

    document.querySelector(".popup-fields").innerHTML += `<button class="action-button" id=${ rowData[id] }>Save</button>`;

    popup.innerHTML += '</div>';

    $(".popup-container").on('click', '.action-button', evt => {
        saveEdit(evt, rowData);
    });
}

function saveEdit(evt, rowData) {
    var bodyData = {};

    for (let key in rowData) {
        bodyData[key] = document.getElementById(key).value.length === 0 ? null : document.getElementById(key).value;
    }

    console.log(bodyData);

    switch (currentTableData.currentTable) {
        case "hotel":
            fetch(`http://localhost:5000/update-hotel/${ evt.currentTarget.id }`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            }).then(response => {
                if (response.status === 200) {
                    $(".popup-container").hide();
                    console.log(currentTableData.currentTable);
                    getDataFrom(currentTableData.currentTable);
                } else {
                    console.log(response);
                }
            });
            break;
        case "vehicle":
            fetch(`http://localhost:5000/update-vehicle/${ evt.currentTarget.id }`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            }).then(response => {
                if (response.status === 200) {
                    $(".popup-container").hide();
                    console.log(currentTableData.currentTable);
                    getDataFrom(currentTableData.currentTable);
                } else {
                    console.log(response);
                }
            });
            break;
        case "driver":
            fetch(`http://localhost:5000/update-driver/${ evt.currentTarget.id }`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            }).then(response => {
                if (response.status === 200) {
                    $(".popup-container").hide();
                    console.log(currentTableData.currentTable);
                    getDataFrom(currentTableData.currentTable);
                } else {
                    console.log(response);
                }
            });
            break;
    }
}