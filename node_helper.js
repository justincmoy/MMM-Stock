var NodeHelper = require("node_helper");
var request = require("request");
var async = require("async");

module.exports = NodeHelper.create({
	start: function () {
		console.log(this.name + " helper method started...");
	},

	sendRequest: function (urls) {
		var self = this;

		var results = {};

		async.eachSeries(urls, function(url, done) {
			request({ url: url, method: "GET" }, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var result = JSON.parse(body);
					var compSymbol = result["symbol"];
					results[compSymbol] = result;
				} else {
					console.log("Error retrieving " + url + ": " + body);
				}
				done();
			});

		}, function(err) {
			if (err) {
				throw err;
			}
			self.sendSocketNotification("STOCK_RESULT", results);
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, url) {
		if (notification === "GET_STOCKS") {
			this.sendRequest(url);
		}
	}
});
