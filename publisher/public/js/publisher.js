function check() {
				var mqtt_data = form1.mes.value;

				if (mqtt_data == 1) {
								mqtt_data = new Uint8Array([1]);
				}
				else if (mqtt_data == 2) {
								mqtt_data = new Uint8Array([2]);
				}
				else if (mqtt_data = 3) {
								mqtt_data = new Uint8Array([3]);
				}

				/* publish to the rete-ble-device's topic as mqtt client */
				
				var topic = "dev1";
				var message;
				var reconectTimeout = 2000;
				
				var client = new Paho.MQTT.Client(
									"u.i.exp", 
									10010, 
									"clientId" + new Date().getTime()
								  );
				var mqtt_client_option = {
								onSuccess: onConnect,
								onFailure: function (message) {
												console.log("Connection failed: " + message.errorMessage + "Retrying");
												setTimeout(MQTTconnect, reconectTimeout);
								}
				};
				function onConnect() {
								// Once a connection has been made, make a subscription and send a message.
								console.log("onConnect");

					 			// client publish a message to topics space
								message = new Paho.MQTT.Message(mqtt_data.buffer);
								message.destinationName = topic;
								message.retained = true;
						  	client.send(message);

								console.log("send a message")
				}
				function onConnectionLost(responseObject) {
								if (responseObject.errorCode !== 0)
												console.log("onConnectionLost:"+responseObject.errorMessage);
				}
				client.onConnectionLost = onConnectionLost;
				client.connect(mqtt_client_option);
}
