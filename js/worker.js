
// TO DO - tidy this up!

this.onmessage = function(e) {
	'use strict';
//  var data = e.data;
//	var url = data.requestURL;
//	var pageName = data.page;
//	var url = e.data.url;
//	var pageName = e.data.page;
//	var id = e.data.id;
	var url = e.data.url;
	var returnObject;
//	console.log(url);
	
	// build params for request dynamically
	var paramaters = {};
	for (var key in e.data) {
//		console.log(key);
		if(!e.data.hasOwnProperty(key)){ continue; }			// skip loop if the property is from prototype
		if(key === 'url'){continue;}							// don't want to pass the URL through as a param
		paramaters[key] = e.data[key];
	}
	
//	console.log(url, paramaters);
	
	request(url, paramaters, function(html) {
//		console.log('html',html);
		var obj=JSON.parse(html);
//		console.log(obj);
		if(obj.Content_end)  {
			returnObject = obj;
			returnObject.sectionName = paramaters.func;
//			console.log('returnObject', returnObject.sectionName);
		} else {
			// To do - what if there is no object?
		}
	}, 'POST');
	
//	console.log(returnObject);
	
	self.postMessage(returnObject);	// - send object back to main.js
	self.close();					// kill the worker
};


// AJAX request using js
function request(url, data, callback, type) {	// params for which function to use and how
	
	var data_array, data_string, idx, req, value;
	data_array = [];
	if (data == null) { 		data = {}; }
	if (callback == null) { 	callback = function() {}; }
	if (type == null) {			type = 'GET'; }					// default to a GET request		

	for (idx in data) {
//		console.log(data);
//		console.log(idx);
		value = data[idx];
		data_array.push("" + idx + "=" + value);
	}

	data_string = data_array.join("&");
	req = new XMLHttpRequest();
	req.open(type, url, false);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.onreadystatechange = function() {
		if (req.readyState === 4 && req.status === 200) {
//			console.log(req.responseText);
			return callback(req.responseText);
	  	}
	};
	req.send(data_string);
	return req;
}

