// Global Variables
var city = "";
var stateInput = "ca";
var eventInput = "baseball";
var startEndDateTime = "2020-09-27" + "T00:00:00Z";
// function for start and end date
$(function () {
  $(".datepicker").datepicker();
});
// Ticketmaster Ajax call
$.ajax({
  url: "https://app.ticketmaster.com/discovery/v2/events.json",
  data: {
    "apikey": "xJY9ixix03PyEzTVRHSf0eldysSBFkoN",
    "stateCode": stateInput,
    "classificationName": eventInput,
    "startEndDateTime": startEndDateTime,
  },
  method: "GET"
}).then(function (response) {
  console.log(response);
  for (var x = 0; x < response._embedded.events.length; x++) {
    // Local Event Variables
    var event = response._embedded.events[x];
    var eventName = event.name;
    var eventDate = event.dates.start.localDate;
    var eventTime = event.dates.start.localTime;
    var eventVenue = event._embedded.venues[0].name;
    var eventAddress = event._embedded.venues[0].address.line1;
    var eventCity = event._embedded.venues[0].city.name + ", " + event._embedded.venues[0].state.stateCode + " " + event._embedded.venues[0].postalCode;
    var priceRangeMin = event.priceRanges[0].min;
    var priceRangeMax = event.priceRanges[0].max;
    var eventLat = event._embedded.venues[0].location.latitude;
    var eventLon = event._embedded.venues[0].location.longitude;

    // If time is not determined yet eventTime will show TBD
    if (eventTime === undefined) {
      eventTime = "TBD";
    }

    // Console Logs
    console.log("Event Name: " + event.name);
    console.log("Event DateTime: " + eventDate + " " + eventTime);
    console.log("Event Venue: " + eventVenue);
    console.log("Event Address: " + eventAddress);
    console.log("Event Address Line2: " + eventCity);
    console.log("Event Price Range: " + priceRangeMin + "$" + "-" + priceRangeMax + "$");
    console.log("Event Lat/Lon: " + eventLat + "/" + eventLon);

    // HTML setup
    var eventCard = $("<div class='card mt-4'>");
    var eventHeader = $("<div class='card-header '>").append("<h1 id='event-name'>" + eventName);
    var eventBody = $("<div class='card-body'>");
    var eventDateTimeP = $("<p id='event-date'>").text(eventDate + " " + eventTime);
    var eventVenueP = $("<p id='event-venue'>").text(eventVenue);
    var eventAddressP = $("<p id='event-address'>").text(eventAddress);
    eventBody.append(eventDateTimeP, eventVenueP, eventAddressP);
    eventCard.append(eventHeader, eventBody);

    $("#event-hotel-info").append(eventCard);
  }

});


function getHotelData(eventLat, eventLon) {
  var query = "new york"
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=" + query,
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "hotels4.p.rapidapi.com",
      "x-rapidapi-key": "111d87e276msh7a7e68922114d72p183e89jsnda0c04325211"
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    console.log(response.suggestions[3].entities[0].name);
  });
}


