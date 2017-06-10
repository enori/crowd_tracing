/* extract parameter from eddystone-URL */

var topic_content = new Object;

// location.search.substring(1): a string after a character "?" of URL
// separate the previus string by '='
var kv=location.search.substring(1).split('=');

　　// store the first object of kv[] into associate array 
topic_content[kv[0]]=kv[1];  // kv[0]: key, kv[1]: topic

console.log(kv[0] + '=' + kv[1]);


/* subscribe to the extracted topic in broker as mqtt client */

var extra_topic = topic_content[kv[0]]; //"dev1";
var ble_data;
var reconnectTimeout = 2000;

var client = new Paho.MQTT.Client(
					//"ueno-fedora-exp.ichikawa-lab.org", // location.hostname
					"u.i.exp", // location.hostname 
					10010, // location.port
					"clientId" + new Date().getTime() // location.clientId: random-data
				  );
var mqtt_client_option = {
				onSuccess: onConnect,
				onFailure: function (message) {
								log("Connection failed: " + message.errorMessage + "Retrying");
								setTimeout(MQTTconnect, reconnectTimeout);
				}
};

// called when the client connects
function onConnect() {
				log("onConnect");
				log(topic_content);
				// client subscribes to extracted topic "extra_topic"
				message = client.subscribe(extra_topic);
}
// called when the client loses its connection
function onConnectionLost(responseObject) {
				if (responseObject.errorCode !== 0)
								log("onConnectionLost:"+responseObject.errorMessage);
}
// called when a message arrives
function onMessageArrived(message) {
				log("onMessageArrived:"+message.payloadString);
				console.log(message.payloadBytes);
				ble_data = message.payloadBytes.slice(0);
}

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.connect(mqtt_client_option);
client.onMessageArrived = onMessageArrived;

/* web bluetooth */

var bluetoothDevice;
var alertLevelCharacteristic;
var web_bluetooth_option = { filters: [{services: [0x180d]}]};

function onClick() {
				bluetoothDevice = null;
				// scan device
				log('Requesting Bluetooth Device...');
				navigator.bluetooth.requestDevice(web_bluetooth_option)
				// connect device
				.then(device => {
								bluetoothDevice = device;
								log('connecting to GATT Server...');
								return bluetoothDevice.gatt.connect();
								})
				// get device's service
				.then(server => {
								log('getting Service...');
								return server.getPrimaryService(0x180d);
								})
				// get device's characteristics
				.then(service => {
								log('getting Characteristic...');
								return service.getCharacteristic(0x2a38);
								})
				.then(characteristics => {
								alertLevelCharacteristic  = characteristics;
								document.querySelector('#sendButton').disabled = false;
								log('writing value...');
								})
				// write remote_control_message on device
				.then(value => {
								console.log(message);
								alertLevelCharacteristic.writeValue(ble_data.buffer);
								log('> message value: ' + ble_data);
								})
				// disconnect after delivering message
				.then(_ => {
								log('message has been written on device');
								})
				.then(device => {
								log('disconnecting from Bluetooth Device...');
								if(!bluetoothDevice){
												log('> Bluetooth Device is already disconnected');
												return;
								}
								if(bluetoothDevice.gatt.connected){
												bluetoothDevice.gatt.disconnect();
												log('Bluetooth Device is disconnected...');
								}else{
												log('> Bluetooth Device is already disconnected');
								}
								})
				// error console
				.catch(error => {
								document.querySelector('#sendButton').disabled = true;
								log('argh!' + error);
				});
}
