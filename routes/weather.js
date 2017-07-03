var express = require('express');
var router = express.Router();
var YQLP= require('yqlp');
var woeid=null;
var util = require('util');

//API definition

router.get('/:location', function(req, res, next) {
  var loc=req.params.location;
  var location= loc; // + ', bd';  // composing the location
  console.log(location);


//fetching woeid-where on earth identifier

YQLP.exec("SELECT woeid FROM geo.places(1) WHERE text=@text",{text:location}, function(error, response) {

    if (error) {
        console.log('Something has messed up:', error);
    } else {
       if(response.query.results){
	console.log(response.query.results);
        woeid = response.query.results.place.woeid;
	}
	else
	{
	data={"response":"Location not fount"};
	res.json(data);
	return;
		}
	
    }

//fetching weather data from Yahoo
YQLP.exec("SELECT * FROM weather.forecast WHERE woeid=@woeid",{woeid:woeid}, function(error, response) {


    if (error) {
        console.log('USomething has messed up:', error);
    } else {
      var results = response.query.results;
      var condition=results.channel.item.condition;
      var wind=results.channel.wind;
      var atmos=results.channel.atmosphere;
      var forecast=results.channel.item.forecast;
      var output=[];
      output.push({'condition':condition});
      output.push({'wind':wind});
      output.push({'atmosphere':atmos});
      output.push({'forecast':forecast});
    }
          res.json(output);
          return;

}

            );
        }
    );
});

module.exports = router;

