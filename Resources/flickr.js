/*
 *  File: flickr.js
 *
 *  Description:
 *      Get photos from flickr.com via API
 *      Set scrollView and rearView on baseView
 *      Set search_box on mainWin
 *
 *  Created: 2010/12/2
 *
 *  Author: Daisuke Kobayashi  poleon.kd@gmail.com
 *
 *  Revision History:
 *      2010/12/2    Created
 *
 */

var Flickr = {
    log : function(text){
	Ti.API.info(text);
    },
    
    wait : function(a, func){
	//Flickr.log(a.length);
	if(a.length > 0){
	    Flickr.log('done getting photos...');
	    func();
	}else{
	    var f = function(){Flickr.wait(a, func);};
	    setTimeout(f, 100);
	}
    },

    getPhotos : function(words){
	if(!words)
	    words = 'iPad';
	var photos = [];
	var id, secret, server, farm, owner;
	var loader = Ti.Network.createHTTPClient();
	var url = 'http://api.flickr.com/services/rest/?' +
	    'method=flickr.photos.search&api_key=' +
	    '58abc315168ff0008467f003e2d28b04' + 
	    '&tags=' + words + '&content_type=1&format=json&nojsoncallback=1';
	
	loader.open('GET', url);
	loader.onload = function(){
	    var re = this.responseText;
	    var data = JSON.parse(re).photos.photo;
	    for(var i = 0; i < data.length; i++){
		id = data[i].id;
		secret = data[i].secret;
		farm = data[i].farm;
		server = data[i].server;
		owner = data[i].owner;
		photos[i] = 'http://farm' + farm + '.static.flickr.com/' + server + '/' + id + '_' + secret + '_b.jpg';
		//Flickr.log(photos[i]);
	    }
	};
	loader.send();

	Flickr.log(photos.length);
	return photos;
    }

};

