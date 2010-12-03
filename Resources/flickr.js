mainWin = Ti.UI.currentWindow;

var Flickr = {
    log : function(text){
	Ti.API.info(text);
    },
    
    wait : function(a, func){
	Flickr.log(a.length);
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
	    /* api key */
	    '&tags=' + words + '&content_type=1&format=json&nojsoncallback=1';
	
	loader.open('GET', url);
	loader.onload = function(){
	    var re = this.responseText;
	    var data = JSON.parse(re).photos.photo;
	    for(var i = 0; i < 50; i++){
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
    },

    photoView : function(photos){
	Flickr.log(1);
	var baseView = Ti.UI.createView({
    	});
	var scrollView = null;
	var rearView = null;
	var views = [];
	var smallviews = [];

	var topbar = Ti.UI.createView({
	    height:50,
	    top:-50,
	    //borderColor:'white',
	    backgroundColor:'black',
	    visible:true
	});
	var topbar_visible = false;
	var search_box = Ti.UI.createSearchBar({
	    barColor:'#000',
	    autocapitalization:true,
	    showCancel:true
	});
	topbar.add(search_box);
	mainWin.add(topbar);

	Flickr.log(2);
	Flickr.wait(photos, function(){
	    Flickr.log(3);
	    rearView = Ti.UI.createView({
		backgroundColor:'black',
	    });
	    baseView.add(rearView);

	    scrollView = Ti.UI.createScrollableView({
		//views:[]
		//showPagingControl:false,
		//pagingControlHeight:30
	    });
	    baseView.add(scrollView);

	    Flickr.log(4);
	    for(var i = 0; i < photos.length; i++){
		views[i] = Ti.UI.createImageView({
		    image:photos[i],
		    backgroundColor:'#000'
		});
		scrollView.addView(views[i]);
		
		smallviews[i] = Ti.UI.createImageView({
		    image:photos[i],
		    backgroundColor:'#000',
		    width:153,
		    left:0 + 153 * i,
		    top:-30
		});
		rearView.add(smallviews[i]);
		
	    }
	    Flickr.log(5);
	    scrollView.addEventListener('singletap', function(e){
		Flickr.log('singletap x:' + e.x + ', y:' + e.y);
		if(!topbar_visible){
		    Flickr.log(topbar_visible)
		    topbar_visible = true;
		    topbar.animate({top:0,
				    curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
				    duration:500
				   });
		    search_box.focus();
		}else{
		    Flickr.log(topbar_visible);
		    topbar_visible = false;
		    topbar.animate({top:-80,curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,duration:500});
		    search_box.blur();
		}
	    });

	    Flickr.log(6);

	    rearView.addEventListener('doubletap', function(e){
		Flickr.log('doubletap in rearView');
		baseView.animate({view:scrollView,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	    });
	    
	    scrollView.addEventListener('doubletap', function(e){
		Flickr.log('doubletap in scrollView');
		baseView.animate({view:rearView,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	    });
	    
	    Flickr.log(7);
	    mainWin.add(baseView);

	    search_box.addEventListener('return', function(e){
		Flickr.log(e.value);
		topbar_visible = false;
		topbar.animate({top:-50,curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,duration:500});
		search_box.blur();
		photos = [];
		photos = Flickr.getPhotos(e.value);
		scrollView.views = [];
		rearView.views = [];
		baseView.remove(rearView);
		baseView.remove(scrollView);
		smallviews = [];
		views = [];
		
		Flickr.wait(photos, function(){
		    for(var i = 0; i < photos.length; i++){
			smallviews[i] = Ti.UI.createImageView({
			    image:photos[i],
			    backgroundColor:'#000',
			    width:153,
			    left:0 + 153 * i,
			    top:-30
			});
			rearView.add(smallviews[i]);
			
			views[i] = Ti.UI.createImageView({
			    image:photos[i],
			    backgroundColor:'#000'
			});
			scrollView.addView(views[i]);
		    }

		    baseView.add(rearView);
		    baseView.add(scrollView);
		});
		//mainWin.add(scrollView);
		//Flickr.log(2);
		
	    });
	    
	    Flickr.log(8);
	});
    },
};

var result = Flickr.getPhotos('shibuya');
Flickr.photoView(result);
mainWin.open();
