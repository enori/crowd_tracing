var util = require('util');
var eddystone = require('eddystone-beacon');
var bleno = require('eddystone-beacon/node_modules/bleno');

var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;

var FRAME_TIME = 5000;

// Characteristic

var EchoCharacteristic = function() {
  EchoCharacteristic.super_.call(this, {
    uuid: '2A38',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(EchoCharacteristic, BlenoCharacteristic);

EchoCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

EchoCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('EchoCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('EchoCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

function startBroadcast() {
	bleno.stopAdvertising();
  console.log("Eddystone-URL is broadcast.");
  eddystone.advertiseUrl('https://u.i.exp/?t1=dev1');
	setTimeout(function(){
					eddystone.stop();
					startConnect();
					bleno.on('advertisingStart', function(error) {
					  if (!error) {
					    bleno.setServices([
					      new BlenoPrimaryService({
					        uuid: '180D',
					        characteristics: [
					          new EchoCharacteristic()
					        ]
					      })
					    ]);
					  }
					});
	},FRAME_TIME);
}

function startConnect() {
	eddystone.stop();
  console.log("Bleno is advertised.");
  bleno.startAdvertising('echo', ['180D']);
	setTimeout(function(){
					bleno.stopAdvertising();
					startBroadcast();
	},FRAME_TIME);
}

// advertising Eddystone and bleno alternately.

console.log('bleno - echo');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
		startBroadcast();
  } else {
    eddystone.stop();
		bleno.stopAdvertising();
  }
});

bleno.on('accept', function() {
  console.log("Accepting connection.");
});

bleno.on('disconnect', function() {
  console.log("Client disconnected ...");
})
