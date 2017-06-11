# Crowd Tracing System


## Introduction

This is the prototype of new messaging system 'Crowd Tracing System.'  
Crowd Tracing System delivers messages from Internet devices to Non-Internet devices via anonymous smartphones.

## Environment

Node.js >= v6.10.0

## How to Use

Install Node.js and Mosquitto.  
Built the MQTT server with Mosquitto. (Do not forget to configure)  

Download '/publisher/' and '/subscriber/' in your desktop PC. And download '/receiver/' in Raspberry Pi.  

### In '/publisher/'

This is the prpgram for building HTTP server that provide the the web page for senders.  
The web page has functions to send the message to the particular subscribers.  
For running program, type this command on your terminal.

```
node server.js
```

And you open the web page that is servered by this HTTP server.  
Then, you can publish a message to the topic 'dev1' on the mosquitto broker.

### In '/subscriber/'

This is the program for building HTTP server that provide the the web page for senders.  
This HTTP server will connect to web browsers on smartphones with SSL. So you need to authenticate the HTTP server.
The web page has bellow functions. 
- extracting the topic from received Eddystone-URL
- Subscribing the topic 'dev1' on the broker and getting messages
- Scanning the Bluetooth connection packets and connecting with Bluetooth devices
- Sending the gotten messages to Bluetooth devices with Bluetooth connection

For running program, type this command on your terminal.

```
node server.js
```

And you open the web page that is servered by this HTTP server with a smartphone.    
Then, you can cooperate the messaging and a Bletooth device will receive the message.

### In '/receiver/'

This is the program for broadcasting the two types of Bluetooth packet and receiving the message.  
Install the Bleno, Bleutooth Low Energy library with JavaScript.

For running program, type this command on your terminal.

```
node advertise.js
```

Raspberry Pi will start to broadcast the packets alternately.  
And when a smartphone sends the message, Raspberry Pi will receive it.

## Presentaion in Public

I had presented about this system in public. 
- [ieice - society](http://www.ieice.org/ken/paper/201612069bQ8/)
- [asn - cambodia workshop](http://www.gakkai-web.net/gakkai/ieice/S_2016/Settings/ab/b_18_015.html)

