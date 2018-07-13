from flask import Flask
from flask_ask import Ask, statement, convert_errors
import Adafruit_BBIO.GPIO as GPIO
import logging
import time

app = Flask(__name__)
ask = Ask(app, '/')

logging.getLogger("flask_ask").setLevel(logging.DEBUG)

@ask.intent('GPIOControlIntent', mapping={'status': 'status', 'location': 'location'})
def gpio_control(status, pin):

    locationDictON = {
		'lamp' : 'P8_18',
		'pc' : 'P8_15'
	}
    locationDictOFF = {
		'lamp' : 'P8_14',
		'pc' : 'P8_16'
	}

    if status in ['on', 'high']:    
	targetPin = locationDictON[location]
	GPIO.setup(targetPin, GPIO.OUT)
	print "ON " , targetPin
	#GPIO.output(targetPin, GPIO.HIGH)
	time.sleep(1)
	#GPIN.output(targetPin, GPIO.LOW)
    
    if status in ['off', 'low']:    
	targetPin = locationDictOFF[location]
	GPIO.setup(targetPin, GPIO.OUT)
	print "OFF " , targetPin
	#GPIO.output(targetPin, GPIO.HIGH)
	time.sleep(1)
	#GPIN.output(targetPin, GPIO.LOW)

    return statement('Turning pin {} {}'.format(targetPin, status))

if __name__ == '__main__':
        app.run()
