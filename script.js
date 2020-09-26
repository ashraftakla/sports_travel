// Global Variables
var city = "";
var stateInput = "ny";
var eventInput = "baseball";
var startDate = "";
var endDate = "";
var startEndDateTime = "2020-09-27" + "T00:00:00Z";

$("#search-button").click(function () {
  // Hotel Function
  function getHotelData(eventLat, eventLon, date) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://tripadvisor1.p.rapidapi.com/hotels/list-by-latlng?lang=en_US&hotel_class=1%252C2%252C3&limit=10&adults=1&rooms=1&child_rm_ages=7%252C10&currency=USD&zff=4%252C6&subcategory=hotel%252Cbb%252Cspecialty&nights=2&latitude=12.91285&longitude=100.87808",
      "data": {
        "checkin": date,
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
  }

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
      var eventName = $("<div class='card-header' id=''>").text(event.name);
      var eventDate = event.dates.start.localDate;
      var eventTime = event.dates.start.localTime;
      var eventVenue = event._embedded.venues[0].name;
      var eventAddress = event._embedded.venues[0].address.line1;
      var eventAddress2 = event._embedded.venues[0].city.name + ", " + event._embedded.venues[0].state.stateCode + " " + event._embedded.venues[0].postalCode;
      var priceRangeMin = event.priceRanges[0].min;
      var priceRangeMax = event.priceRanges[0].max;
      var priceRange = priceRangeMin + "-" + priceRangeMax + "$ USD";
      var eventURL = event.url;
      var eventLat = event._embedded.venues[0].location.latitude;
      var eventLon = event._embedded.venues[0].location.longitude;

      // Setting date to show month/day/year
      eventDate = eventDate.split("-");
      console.log(eventDate);
      var eventDateFinal = eventDate[1] + "/" + eventDate[2] + "/" + eventDate[0];
      console.log(eventDateFinal);

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
      var eventLeft = $("<div class='card level-item has-text-centered'>");
      var eventRight = $("<div class='card level-item has-text-centered'>")
      var eventDateP = $("<div class='card-content' id='event-date'>").text(eventDateFinal + ' ' + eventTime);
      var eventVenueP = $("<p id='event-venue'>").text(eventVenue);
      var eventAddressP = $("<p id='event-address'>").text(eventAddress);
      var eventAddress2P = $("<p id='event-address-2'>").text(eventAddress2);
      var ticketInfoP = $("<p id='ticket-info'>").text("Price Range: " + priceRange);
      eventLeft.append(eventVenueP, eventAddressP, eventAddress2P);
      eventRight.append(eventDateP, ticketInfoP);
      eventCard.append(eventLeft, eventRight);

      $("#event-hotel-info").append(eventCard);
      eventClick(eventURL);
    }
    getHotelData(eventLat, eventLon, eventDate);
  });
})

// Click event for the tickets for the event
function eventClick(eventURL) {
  $("#event-card").click(function () {
    window.open(eventURL);
  });
}
