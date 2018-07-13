// request needed modules
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var b = require('bonescript');

// init server
app.listen(300);
var v = 0;
var leds = ["P8_18", "P8_14", "P8_15", "P8_16", "P8_17",  "P9_14", "P9_15", "P9_16", "P9_17", "P9_18", "USR0", "USR1", "USR2", "USR3"];

var state = b.LOW;
for(var i in leds) {
    b.pinMode(leds[i], b.OUTPUT);
    b.digitalWrite(leds[i], state);
}


setup = function() {
    pinMode(ledPin, OUTPUT);
};

var myBody = {
    aString: "Test I AM OK"
};

// server logic
function handler(req, res) {

    // Set CORS headers
    var headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
    };
    res.writeHead(200, headers);

    if (req.method == 'POST') {
        console.log(v + " POST");
        v++;

        req.on('data', function (data) {
            console.log(v + " DATA : " + data);
            myBody.aString = JSON.parse(data).device + " " + JSON.parse(data).status;
	    if(JSON.parse(data).device == "FAN")
	    {	    			    
	    	if(JSON.parse(data).status == "ON")
	    	{
        	  console.log("Lamp On");
		  b.digitalWrite(leds[0], b.HIGH);
		  delay(500);
		  b.digitalWrite(leds[0], b.LOW);
	   	}
	    	else
	    	{
	          console.log("Lamp Off");
		  b.digitalWrite(leds[5], b.HIGH);
		  delay(500);
		  b.digitalWrite(leds[5], b.LOW);
	        }
	    }
	    else{
	    	if(JSON.parse(data).status == "ON")
	    	{
        	  console.log("Lamp On");
		  b.digitalWrite(leds[4], b.HIGH);
		  delay(500);
		  b.digitalWrite(leds[4], b.LOW);
	   	}
	    	else
	    	{
	          console.log("Lamp Off");
		  b.digitalWrite(leds[9], b.HIGH);
		  delay(500);
		  b.digitalWrite(leds[9], b.LOW);
	        }
	    }
        });

        req.on('end', function () {

            res.end(JSON.stringify(myBody));
        });

    }
    else if (req.method == 'OPTIONS') {

        res.end();
    }
    else if (req.method == 'GET') {
  	fs.readFile('index.html',
  	function (err, data) {
    	if (err) {
      		res.writeHead(500);
      		return res.end('Error loading index.html');
    	}
     	res.end(data);
  	});
    }
}

io.sockets.on('connection', function (socket) {
  socket.on('led', function (input) {
    var i = input.slice(0, 1);  
    var data = input.slice(1,input.lenght);
    console.log(i + "   " + data);
    if (data == 'on'){
        b.digitalWrite(leds[i], b.HIGH);
        socket.emit('ledstatus', 'red');
        socket.broadcast.emit('ledupdate', 'green');
        delay(500);
        b.digitalWrite(leds[i], b.LOW);
        socket.emit('ledstatus', 'white');
        socket.broadcast.emit('ledupdate', 'red');
    }else{
        b.digitalWrite(leds[i], b.LOW);
        socket.emit('ledstatus', 'red');
        socket.broadcast.emit('ledupdate', 'red');
    }
  });
});
 
function delay(ms) {
        var cur_d = new Date();
        var cur_ticks = cur_d.getTime();
        var ms_passed = 0;
        while(ms_passed < ms) {
            var d = new Date();  // Possible memory leak?
            var ticks = d.getTime();
            ms_passed = ticks - cur_ticks;
            // d = null;  // Prevent memory leak?
        }
 } 
