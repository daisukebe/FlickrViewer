Ti.include('flickr.js');
mainWin = Ti.UI.currentWindow;

(function(){
    var f = Flickr;
    var photos = f.getPhotos('macbook');
    var views = [];
    var smallviews = [];
    
    var baseView = Ti.UI.createView({
    });
    var rearView = Ti.UI.createScrollView({
	backgroundColor:'black',
	top:0,
	//bottom:0,
	visible:false,
	contentWidth:'auto',
	contentHeight:'auto',
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:false
	
    });
    baseView.add(rearView);
    
    var scrollView = Ti.UI.createScrollableView({
	//views:[]
	//showPagingControl:false,
	//pagingControlHeight:30
    });
    baseView.add(scrollView);
    
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
    
    f.wait(photos, function(){
	//Ti.API.info("O: " + Ti.UI.orientation);
	var t = 0, l = 0;
	for(var i = 0; i < photos.length; i++){
	    views[i] = Ti.UI.createImageView({
		image:photos[i],
		backgroundColor:'#000'
	    });
	    scrollView.addView(views[i]);
	    
	    if(i > 0 && i % 8 === 0){
		t += 96;
		l = 0;
	    }
	    smallviews[i] = Ti.UI.createImageView({
		image:photos[i],
		backgroundColor:'#000',
		width:96,
		height:96,
		left:96 * l++,
		top:t
	    });
	    rearView.add(smallviews[i]);
	    
	}
    });
	
    scrollView.addEventListener('singletap', function(e){
	f.log('singletap x:' + e.x + ', y:' + e.y);
	if(!topbar_visible){
	    f.log(topbar_visible)
	    topbar_visible = true;
	    topbar.animate({top:0,
			    curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
			    duration:500
			   });
	    search_box.focus();
	}else{
	    f.log(topbar_visible);
	    topbar_visible = false;
	    topbar.animate({top:-80,curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,duration:500});
	    search_box.blur();
	}
    });
    
    rearView.addEventListener('doubletap', function(e){
	f.log('doubletap in rearView');
	baseView.animate({view:scrollView,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	rearView.visible = false;
	scrollView.visible = true;
    });
	
    scrollView.addEventListener('doubletap', function(e){
	f.log('doubletap in scrollView');
	baseView.animate({view:rearView,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	scrollView.visible = false;
	rearView.visible = true;
    });
    
    mainWin.add(baseView);
	
    search_box.addEventListener('return', function(e){
	//rearView.visible = false;
	//scrollView.visible = true;

	topbar_visible = false;
	topbar.animate({top:-50,curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,duration:500});
	search_box.blur();
	
	photos = [];
	photos = f.getPhotos(e.value);
	scrollView.views = [];
	rearView.views = [];
	//baseView.remove(rearView);
	//baseView.remove(scrollView);
	smallviews = [];
	views = [];
	
	f.wait(photos, function(){
	    //Ti.API.info("O: " + Ti.UI.orientation);
	    t = l = 0;
	    for(var i = 0; i < photos.length; i++){
		if(i > 0 && i % 8 === 0){
		    t += 96;
		    l = 0;
		}
		smallviews[i] = Ti.UI.createImageView({
		    image:photos[i],
		    backgroundColor:'#000',
		    width:96,
		    height:96,
		    left:96 * l++,
		    top:t
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

	    rearView.visible = false;
	    scrollView.visible = true;

	});
	//mainWin.add(scrollView);
	//f.log(2);
	
    });

    Ti.Gesture.addEventListener('orientationchange', function(e){
	var o = Ti.Gesture.orientation;
	if(o == 0 || o == 1 || o == 2)
	    Ti.API.info('TATE');
	else if(o == 3 || o == 4)
	    Ti.API.info('YOKO');
	else
	    Ti.API.info('other:' + o);
    });
    
})();

mainWin.open();
