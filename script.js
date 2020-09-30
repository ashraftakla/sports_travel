// Global Variables
var city = "";
var stateInput = "";
var eventInput = "";
var endDate = "";
var eventURL

$(function () {
  $(".datepicker").datepicker();
});


// Hotel Function
function getHotelData(eventLat, eventLon, year, month, day, eventInfoDiv, eventURL, eventVenue) {
  var checkIn = year + "/" + month + "/" + day;

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://tripadvisor1.p.rapidapi.com/hotels/list-by-latlng?lang=en_US&hotel_class=1%252C2%252C3&limit=5&adults=1&rooms=1&child_rm_ages=7%252C10&currency=USD&zff=4%252C6&subcategory=hotel%252Cbb%252Cspecialty&nights=2",
    "data": {
      "checkin": checkIn,
      "latitude": eventLat,
      "longitude": eventLon,
    },
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
      "x-rapidapi-key": "094fd923e7msh5e28ed2c46e4f6ap10bdc3jsn237fc5b2027c",
    }
  }
  $.ajax(settings).done(function (response) {
    // For loop to go thru the list of hotels provided by the API
    for (var h = 0; h < response.data.length; h++) {
      var hotel = response.data[h];
      var hotelName = hotel.name;
      var hotelDistance = Math.floor(hotel.distance);
      var hotelPrice = hotel.price_level;
      var rating = hotel.rating;

      //Hotel HTMl Setup
      var hotelNameP = $("<p class='card-header-title is-centered'>").text(hotelName);
      var hotelPriceP = $("<p class='hotel-price'>").text("Price Level: " + hotelPrice + " " + "Rating: " + rating + "/5.0");
      var hotelDistP = $("<p class='hotel-distance'>").text("Distance from " + eventVenue + ": " + hotelDistance + " mile(s)");

      // Appending hotel infor to the eventInfoDiv
      eventInfoDiv.append(hotelNameP, hotelPriceP, hotelDistP);
    }
  });
};

// Ticket function
function getTicketData() {
  // Variables to grab the value or make empty string 
  city = $("#user-city").val() || "";
  startDate = $("#start-date").val() || "";

  // Adjustments to dat to get it in the correct order to API parameter
  startDate = startDate.split("/");
  var year = startDate[2];
  var month = startDate[0];
  var day = startDate[1];
  var finalStartDate = year + "-" + month + "-" + day;

  // If sport not picked eventInput will be empty string
  if (eventInput === "Choose Sport") {
    eventInput = "";
  }

  // Ticketmaster Ajax call
  $.ajax({
    url: "https://app.ticketmaster.com/discovery/v2/events.json",
    // API parameters
    data: {
      "apikey": "xJY9ixix03PyEzTVRHSf0eldysSBFkoN",
      "size": "8",
      "radius": "500",
      "keyword": "sports",
      "city": city,
      "stateCode": stateInput,
      "classificationName": eventInput,
      "localStartDateTime": finalStartDate + "T00:00:00",
    },
    method: "GET"
  }).then(function (response) {

    // If no events available.  Due to COVID-19 no events will display, if we include ticket availability in our IF statement.
    if (response._embedded != undefined) {

      // For loop to go through each event 
      for (var x = 0; x < response._embedded.events.length; x++) {

        // Response variables
        var event = response._embedded.events[x];
        var eventName = event.name;
        var eventStatus = event.dates.status.code;
        var eventDate = event.dates.start.localDate;
        var eventTime = event.dates.start.localTime;
        var eventVenue = event._embedded.venues[0].name;
        var eventAddress = event._embedded.venues[0].address.line1;
        var eventAddress2 = event._embedded.venues[0].city.name + ", " + event._embedded.venues[0].state.stateCode + " " + event._embedded.venues[0].postalCode;
        eventURL = event.url;
        var eventLat = event._embedded.venues[0].location.latitude;
        var eventLon = event._embedded.venues[0].location.longitude;

        // Setting date to show month/day/year
        eventDate = eventDate.split("-");
        var eventDateFinal = eventDate[1] + "/" + eventDate[2] + "/" + eventDate[0];

        // If time is not determined yet eventTime will show TBD
        if (eventTime === undefined) {
          var finalTime = "TBD";
        } else {
          eventTime = eventTime.split(":");
          var hours = eventTime[0];
          var minutes = eventTime[1];
          var AmOrPm = hours >= 12 ? 'pm' : 'am';
          hours = (hours % 12) || 12;
          finalTime = hours + ":" + minutes + AmOrPm;
        }

        // If price range is undefined it will show prices unavailable
        if (event.priceRanges != undefined) {
          var priceRangeMin = event.priceRanges[0].min;
          var priceRangeMax = event.priceRanges[0].max;
          var priceRange = priceRangeMin + "-" + priceRangeMax + "$ USD";
        } else {
          priceRange = "Prices Unavailable";
        }

        // HTML setup with bulma framework
        var eventCard = $("<div class='card mt-4 has-text-centered event-card'>");
        var eventHeader = $("<div class='card-header'>");
        var eventHeaderP = $("<div class='card-header-title is-centered event-header'>").text(eventName + " Status: " + eventStatus);
        var eventInfoDiv = $("<div class='card-content event-info-div'>");
        var eventVenueP = $("<p class='event-venue card-header-title is-centered'>").text(eventVenue);
        var eventAddressP = $("<p class='event-address'>").text(eventAddress);
        var eventAddress2P = $("<p class='event-address-2'>").text(eventAddress2);
        var ticketInfoP = $("<p class='ticket-info'>").text(eventDateFinal + ' ' + finalTime + " --- " + "Price Range: " + priceRange);
        var urlLink = $(`<a target='_blank' href=${eventURL}>`).text("Click here for Ticket Info!");
        // Appending correctly based off Bluma framework
        eventHeader.append(eventHeaderP);
        eventInfoDiv.append(eventVenueP, eventAddressP, eventAddress2P, ticketInfoP, urlLink);
        eventCard.append(eventHeader, eventInfoDiv);
        $("#event-info").append(eventCard);
        // Call get hotel data function
        getHotelData(eventLat, eventLon, year, month, day, eventInfoDiv, eventURL, eventVenue);
      }
    } else {
      // If no events the page will display that there are no events available
      $("#event-info").addClass("has-text-centered has-text-white").text("No Events Available, Please Search Again");
    }
  });
}

// Wait until document is ready
$(document).ready(function () {
  // Making sure there is something in the city input
  $("#use-city").keypress(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      $("#search-button").click();
    }
  });

  // Function to pull the correct info from the state and sport in the search bar
  // State
  $("#user-state").change(function () {
    var state = "";
    $("#user-state option:selected").each(function () {
      state += $(this).text();
    });
    stateInput = state;
  }).trigger("change");
  // Sport
  $("#user-sport").change(function () {
    var sport = "";
    $("#user-sport option:selected").each(function () {
      sport += $(this).val();
    });
    eventInput = sport;
  }).trigger("change");

  // Search button function
  $("#search-button").click(function () {
    $("#event-info").empty();
    getTicketData();
  });

})
