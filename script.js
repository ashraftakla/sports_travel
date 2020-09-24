var stateInput = "ca";
var eventInput = "baseball";
var startEndDateTime = "2020-09-27" + "T00:00:00Z";

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
  // console.log(response._embedded.events[0])

});

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
  console.log(response.suggestions[3].entities[0].name)
});