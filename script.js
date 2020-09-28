// Global Variables
var city = $("#user-city").text() || "";
var stateInput = "";
var eventInput = "baseball";
var startDate = "";
var endDate = "";
var startEndDateTime = "2020-09-27" + "T00:00:00Z";

// Function to pull the correct state info from the search bar
$("select").change(function () {
    var str = "";
    $("select option:selected").each(function () {
        str += $(this).text().toLowerCase() + " ";
    });
    stateInput = str;
}).trigger("change");

// Hotel Function
function getHotelData(eventLat, eventLon, eventDate) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://tripadvisor1.p.rapidapi.com/hotels/list-by-latlng?lang=en_US&hotel_class=1%252C2%252C3&limit=5&adults=1&rooms=1&child_rm_ages=7%252C10&currency=USD&zff=4%252C6&subcategory=hotel%252Cbb%252Cspecialty&nights=2",
        "data": {
            "checkin": eventDate,
            "latitude": eventLat,
            "longitude": eventLon,
        },
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
            "x-rapidapi-key": "660e4c976emsh79b686d93d6b038p1d5f41jsnffb01ced2e18"
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
};

function getTicketData() {
    // Ticketmaster Ajax call
    $.ajax({
        url: "https://app.ticketmaster.com/discovery/v2/events.json",
        data: {
            "apikey": "xJY9ixix03PyEzTVRHSf0eldysSBFkoN",
            "stateCode": stateInput,
            "city": city,
            "classificationName": eventInput,
            "startEndDateTime": startEndDateTime,
        },
        method: "GET"
    }).then(function (response) {
        console.log(response);
        if (response._embedded != undefined) {
            // Local Event Variables
            for (var x = 0; x < response._embedded.events.length; x++) {
                var event = response._embedded.events[x];
                var eventName = event.name;
                var eventDate = event.dates.start.localDate;
                var eventTime = event.dates.start.localTime;
                var eventVenue = event._embedded.venues[0].name;
                var eventAddress = event._embedded.venues[0].address.line1;
                var eventAddress2 = event._embedded.venues[0].city.name + ", " + event._embedded.venues[0].state.stateCode + " " + event._embedded.venues[0].postalCode;
                var eventURL = event.url;
                var eventLat = event._embedded.venues[0].location.latitude;
                var eventLon = event._embedded.venues[0].location.longitude;

                // Setting date to show month/day/year
                eventDate = eventDate.split("-");
                var eventDateFinal = eventDate[1] + "/" + eventDate[2] + "/" + eventDate[0];

                // If time is not determined yet eventTime will show TBD
                if (eventTime === undefined) {
                    eventTime = "TBD";
                } else {
                    eventTime = eventTime.split(":");
                    var hours = eventTime[0];
                    var minutes = eventTime[1];
                    var AmOrPm = hours >= 12 ? 'pm' : 'am';
                    hours = (hours % 12) || 12;
                    var finalTime = hours + ":" + minutes + AmOrPm;
                }
                // If price range is undefined it will show prices unavailable
                if (event.priceRanges != undefined) {
                    var priceRangeMin = event.priceRanges[0].min;
                    var priceRangeMax = event.priceRanges[0].max;
                    var priceRange = priceRangeMin + "-" + priceRangeMax + "$ USD";
                } else {
                    priceRange = "Prices Unavailable";
                }

                // // Console Logs
                // console.log("Event Name: " + event.name);
                // console.log("Event DateTime: " + eventDateFinal + " " + finalTime);
                // console.log("Event Venue: " + eventVenue);
                // console.log("Event Address: " + eventAddress);
                // console.log("Event Address Line2: " + eventAddress2);
                // console.log("Event Price Range: " + priceRange);
                // console.log("Event Lat/Lon: " + eventLat + "/" + eventLon);

                // HTML setup
                var eventCard = $("<div class='card mt-4 has-text-centered' id='event-card'>");
                var eventHeader = $("<div class='card-header' id='event-header'>").text(eventName);
                var eventInfoDiv = $("<div class='card-content' id='event-info-div'>");
                var eventVenueP = $("<p id='event-address'>").text(eventVenue);
                var eventAddressP = $("<p id='event-address'>").text(eventAddress);
                var eventAddress2P = $("<p id='event-address-2'>").text(eventAddress2);
                var ticketInfoP = $("<p id='ticket-info'>").text(eventDateFinal + ' ' + finalTime + " --- " + "Price Range: " + priceRange);
                var eventAddressDiv = eventVenueP.append(eventAddressP, eventAddress2P)

                eventInfoDiv.append(eventAddressDiv, ticketInfoP);
                eventCard.append(eventHeader, eventInfoDiv);
                $("#event-hotel-info").append(eventCard);

            }

            getHotelData(eventLat, eventLon, eventDate);
        } else {
            $("#event-hotel-info").addClass("level-item has-text-centered").text("No Events Available, Please Search Again");
        }
    });


}

// Search button function
$("#search-button").click(function () {
    $("#event-hotel-info").empty();
    getTicketData();
})

// Click event for the tickets for the event
$("#event-card").click(function () {
    window.open(eventURL);
});