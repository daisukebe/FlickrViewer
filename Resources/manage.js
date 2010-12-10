Ti.include('flickr.js');
mainWin = Ti.UI.currentWindow;

(function(){
    var photos = Flickr.getPhotos('macbook');
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
    
    Flickr.wait(photos, function(){
	rearView = Ti.UI.createScrollView({
	    backgroundColor:'black',
	    top:0,
	    //bottom:0,
	    visible:false,
	    contentWidth:'auto',
	    contentHeight:'auto',
	    showVerticalScrollIndicator:true,
	    showHorizontalScrollIndicator:true

	});
	baseView.add(rearView);
	
	scrollView = Ti.UI.createScrollableView({
	    //views:[]
	    //showPagingControl:false,
	    //pagingControlHeight:30
	});
	baseView.add(scrollView);
	
	var t = 0, l = 0;
	for(var i = 0; i < photos.length; i++){
	    views[i] = Ti.UI.createImageView({
		image:photos[i],
		backgroundColor:'#000'
	    });
	    scrollView.addView(views[i]);
	    
	    if(i > 0 && i % 8 === 0){
		//t += 256;
		//t += 190;
		t += 96;
		l = 0;
	    }
	    smallviews[i] = Ti.UI.createImageView({
		image:photos[i],
		backgroundColor:'#000',
		//width:190,
		//width:256,
		//height:256,
		//height:190,
		//left:192 * l++,
		//left:256 * l++,
		width:96,
		height:96,
		left:96 * l++,
		top:t
	    });
	    rearView.add(smallviews[i]);
	    
	}
	
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
	
	rearView.addEventListener('doubletap', function(e){
	    Flickr.log('doubletap in rearView');
	    baseView.animate({view:scrollView,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	    rearView.visible = false;
	    scrollView.visible = true;
	});
	
	scrollView.addEventListener('doubletap', function(e){
	    Flickr.log('doubletap in scrollView');
	    baseView.animate({view:rearView,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	    scrollView.visible = false;
	    rearView.visible = true;
	});
	
	mainWin.add(baseView);
	
	search_box.addEventListener('return', function(e){
	    topbar_visible = false;
	    topbar.animate({top:-50,curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,duration:500});
	    search_box.blur();
	    
	    photos = [];
	    photos = Flickr.getPhotos(e.value);
	    scrollView.views = [];
	    rearView.views = [];
	    //baseView.remove(rearView);
	    //baseView.remove(scrollView);
	    smallviews = [];
	    views = [];
	    
	    Flickr.wait(photos, function(){
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

		    rearView.visible = false;
		    scrollView.visible = true;
		}
		
		baseView.add(rearView);
		baseView.add(scrollView);
	    });
	    //mainWin.add(scrollView);
	    //Flickr.log(2);
	    
	});
	
    });
})();

mainWin.open();
