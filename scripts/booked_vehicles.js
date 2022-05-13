import ServerAPI from "./server_api.js";

$(document).ready(() => {
    $("#close-popup").click(() => {
        $(".confirmation-popup-container").hide();
    });

    if (sessionStorage.getItem("name") === null) {
        $("#no-login").css("display", "flex");
        $(".booked-vehicles-container").hide();
        $(".top-banner").hide();
    } else {
        $("#no-login").hide();
        $(".booked-vehicles-container").css("display", "flex");
        $(".top-banner").css("display", "flex");

        viewBookings();
    }
});

function viewBookings() {
    ServerAPI.getBookedVehicles(sessionStorage.getItem("uid"), response => {
        document.querySelector(".booked-vehicles-container").innerHTML = ""; 

        if (response.status === 200) {
            var data = response.data;
            console.log(data);

            for (var i = 0; i < data.length; i++) {
                var fromDate = data[i].from_date.replace("T", " ");
                fromDate = fromDate.split(".")[0];

                var toDate = data[i].till_date.replace("T", " ");
                toDate = toDate.split(".")[0];

                var isOutdated = (new Date(data[i].from_date) - new Date()) <= 0;

                var vehicleBox = `
                <div class="${ isOutdated ? "car-container old" : "car-container" }">
                    <div>
                        From: <span id="from-time">${ fromDate }</span> <br/>
                        To: <span id="to-time">${ toDate }</span> <br/>
                        License Plate Number: <span id="license-plate">${ data[i].license_plate }</span> <br/>
                        Colour: <span id="colour">${ data[i].colour }</span> <br/>
                        Type: <span id="type">${ data[i].type }</span> <br/>
                    </div>
                    <div>
                        Driver's Name: <span id="driver-name">${ data[i].driver_name }</span> <br/>
                        Phone Number: <span id="phone-number">${ data[i].phone_num }</span>
                    </div>
                    <button class="action-button" id="${ data[i].booking_id }">${ isOutdated ? "Remove Booking" : "Cancel Booking" }</button>
                </div>
                `;

                document.querySelector(".booked-vehicles-container").innerHTML += vehicleBox;
                $(".car-container").on('click', 'button', showPopup);
            }
        } else if (response.status === 204) {
            document.querySelector(".booked-vehicles-container").innerHTML = 
                `<h1>No vehicles booked.</h1>
                <div>
                    To book a vehicle, click <a href="/vehicle-booking">this link</a>
                </div>`;
        }
    });
}

function showPopup(evt) {
    $(".confirmation-popup-container").css("display", "flex");
    $(".confirmation-popup").off('click', '.action-button');
    $(".confirmation-popup .action-button").attr("id", evt.currentTarget.id);
    $(".confirmation-popup").on('click', '.action-button', cancelBooking);
}

function cancelBooking(evt) {
    ServerAPI.cancelBooking(evt.currentTarget.id, response => {
        console.log(response);
        if (response.status === 200) {
            $(".confirmation-popup-container").hide();
            viewBookings();
            alert("Booking canceled.");
        } else {
            alert("Internal server error, please try again later.");
            console.log(response);
        }
    });
}