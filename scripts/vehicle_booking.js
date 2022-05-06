import ServerAPI from "./server_api.js";

var data = {};
var vehicleDetails = {};

$(document).ready(() => {
    if (sessionStorage.getItem("name") === null) {
        $("#no-login").css("display", "flex");
        $("#filters-container").hide();
        $(".top-banner").hide();
    } else {
        $("#no-login").hide();
        $("#filters-container").css("display", "flex");
        $(".top-banner").css("display", "flex");
    }

    $("#none-available").hide();

    $("#find-vehicles").click(() => {
        var fromTime = $("#from-time").val();
        var toTime = $("#to-time").val();
        var flag = false;

        console.log(fromTime, toTime);

        if (fromTime === "") {
            $("#from-time-error").text("*Mandatory");
            flag = true;
        } else {
            $("#from-time-error").text("");
        }

        if (toTime === "") {
            $("#to-time-error").text("*Mandatory");
            flag = true;
        } else {
            $("#to-time-error").text("");
        }

        if (!flag) {
            flag = false;

            const currDatetime = new Date();
            const ftDatetime = new Date(fromTime.split("T")[0] + " " + fromTime.split("T")[1]);
            const ttDatetime = new Date(toTime.split("T")[0] + " " + toTime.split("T")[1]);

            if (currDatetime.getTime() > ftDatetime.getTime()) {
                $("#from-time-error").text("Cannot book from before current date and time.");
                flag = true;
            }

            if (ftDatetime.getTime() > ttDatetime.getTime()) {
                $("#to-time-error").text("To time should not be before from time.");
                flag = true;
            }

            if (!flag) {
                data.fromTime = `${ fromTime.split("T")[0] }+${ fromTime.split("T")[1] }:00`;
                data.toTime = `${ toTime.split("T")[0] }+${ toTime.split("T")[1] }:00`;

                getAndViewVehicles();
            }
        }
    });

    $("#close-popup").click(() => {
        $(".confirmation-popup-container").hide();
    });
});

function getAndViewVehicles() {
    const carType = $("#car-type").val();
    document.getElementById("cars-container").innerHTML = "";

    ServerAPI.getVehicles(data.fromTime, data.toTime, carType === "None" ? null : carType, response => {
        if (response.data.length === 0) {
            $("#none-available").show();
        } else {
            $("#none-available").hide();
            const respData = response.data;

            for (var i = 0; i < response.data.length; i++) {
                var vehicleBox = `
                <div class="car-container">
                    <div>
                        License Plate: <span>${ respData[i].vehicle_details.license_plate }</span> <br/>
                        Colour: <span>${ respData[i].vehicle_details.colour }</span>
                    </div>
                    <div>
                        Driver Name: <span>${ respData[i].driver_details.name }</span><br/>
                        Car Type: <span>${ respData[i].vehicle_details.type }</span>
                    </div>
                    <button class="action-button" id="${ respData[i].vehicle_details.license_plate }">Book</button>
                </div>
                `;

                vehicleDetails[respData[i].vehicle_details.license_plate] = {
                    licensePlate: respData[i].vehicle_details.license_plate,
                    colour: respData[i].vehicle_details.colour,
                    name: respData[i].driver_details.name
                }

                document.getElementById("cars-container").innerHTML += vehicleBox;
            }

            document.getElementById("cars-container").innerHTML += "<span id='bottom'></span>";
            location.replace("http://localhost:5000/vehicle-booking#bottom");

            $("#cars-container").on('click', 'button', showConfirmation);   
        }
    });
}

function showConfirmation(evt) {
    $(".confirmation-popup-container").css("display", "flex");
    $("#popup-from-time").text(data.fromTime.split("+")[0] + " " + data.fromTime.split("+")[1]);
    $("#popup-to-time").text(data.toTime.split("+")[0] + " " + data.toTime.split("+")[1]);
    $("#popup-colour").text(vehicleDetails[evt.currentTarget.id].colour);
    $("#popup-license").text(vehicleDetails[evt.currentTarget.id].licensePlate);
    $("#popup-driver-name").text(vehicleDetails[evt.currentTarget.id].name);

    $(".confirmation-popup").off('click', '.action-button');
    $(".confirmation-popup .action-button").attr("id", evt.currentTarget.id);
    $(".confirmation-popup").on('click', '.action-button', book);
}

function book(evt) {
    ServerAPI.bookVehicle(sessionStorage.getItem("uid"), data.fromTime, data.toTime, evt.currentTarget.id, response => {
        if (response.status === 200) {
            $(".confirmation-popup-container").hide();
            getAndViewVehicles();
            alert("Booking complete!");
        } else {
            alert(response);
        }
    });
}