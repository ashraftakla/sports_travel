// Global Variables
var city = "";
var stateInput = "ny";
var eventInput = "baseball";
var startDate = "";
var endDate = "";
var startEndDateTime = "2020-09-27" + "T00:00:00Z";



$("#search-button").click(function () {

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

    // Local Event Variables
    for (var x = 0; x < response._embedded.events.length; x++) {
      var event = response._embedded.events[x];
      var eventName = event.name;
      var eventDate = event.dates.start.localDate;
      var eventTime = event.dates.start.localTime;
      var eventVenue = event._embedded.venues[0].name;
      var eventAddress = event._embedded.venues[0].address.line1;
      var eventAddress2 = event._embedded.venues[0].city.name + ", " + event._embedded.venues[0].state.stateCode + " " + event._embedded.venues[0].postalCode;
      var priceRangeMin = event.priceRanges[0].min;
      var priceRangeMax = event.priceRanges[0].max;
      var priceRange = priceRangeMin + "$" + "-" + priceRangeMax + "$";
      var eventURL = event.url;
      var eventLat = event._embedded.venues[0].location.latitude;
      var eventLon = event._embedded.venues[0].location.longitude;
      var x = x;
      // Setting date to show month/day/year
      eventDate = JSON.stringify(eventDate);
      eventDate.split();
      var eventDateFinal = eventDate[6] + eventDate[7] + "/" + eventDate[9] + eventDate[10] + "/" + eventDate[1] + eventDate[2] + eventDate[3] + eventDate[4];

      // If time is not determined yet eventTime will show TBD
      if (eventTime === undefined) {
        eventTime = "TBD";
      }

      // // Console Logs
      // console.log("Event Name: " + event.name);
      // console.log("Event DateTime: " + eventDateFinal + " " + eventTime);
      // console.log("Event Venue: " + eventVenue);
      // console.log("Event Address: " + eventAddress);
      // console.log("Event Address Line2: " + eventAddress2);
      // console.log("Event Price Range: " + priceRange);
      // console.log("Event Lat/Lon: " + eventLat + "/" + eventLon);

      // HTML setup
      var eventCard = $("<div class='card mt-4' id='event-card'>");
      var eventHeader = $("<div class='card-header'>").append("<h1 id='event-name'>" + eventName);
      var eventBody = $("<div class='card-body'>");
      var eventDateTimeP = $("<p id='event-date'>").text(eventDateFinal + " " + eventTime);
      var eventVenueP = $("<p id='event-venue'>").text(eventVenue);
      var eventAddressP = $("<p id='event-address'>").text(eventAddress);
      var eventAddress2P = $("<p id='event-address-2'>").text(eventAddress2);
      var ticketInfoP = $("<p id='ticket-info'>").text("Price Range: " + priceRange + " | " + "");
      eventBody.append(eventVenueP, eventAddressP, eventAddress2P, eventDateTimeP, ticketInfoP);
      eventCard.append(eventHeader, eventBody);

      $("#event-hotel-info").append(eventCard);
      eventClick(eventURL);
    }
  });
})

// Click event for the tickets for the event
function eventClick(eventURL) {
  $("#event-card").click(function () {
    window.open(eventURL);
  });
}



