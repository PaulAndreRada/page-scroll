$(function(){ 
	//	
	var VerticalCarousel = function( element ){ 
	        
	    var VC = {},
	    $doc = $( document ),
	    $element = $doc.find( element ), 
	    $container = $element.find( 'ul' ), 
	    $panes = $container.find( 'li' ), 
	    paneHeight = 0,
	    paneCount = $panes.length,
	    currentPane = 0,
	    animationTime = 450,
	    lastAnimationTime;
	    

	    VC.init = function(){ 
		//
		VC.setPaneDimensions();
		//
		$(window).on("load resize orientationchange", 
			     function() {
				 VC.setPaneDimensions();
			     });
		//
		return VC;
	    };

	        
	    VC.setPaneDimensions = function(){ 
		//
		paneHeight = $element.height();
		//
		for ( var i=0; i<paneCount; i++ ){ 
		    // 
		    $panes.height( paneHeight );
		    //
		};
		//
		$container.height( paneHeight * paneCount );
		//
		return VC;
	    };
	        
	        
	    VC.showPane = function( index ) { 
		//
		// prevent going under or over
		var index = Math.max( 0, Math.min( index,
						   paneCount -1 ));
		//
		currentPane = index;
		// 
		// create the offset value for the container
		// starting at 0
		var offset = -(( 100/paneCount ) * currentPane );
		//
		VC.setContainerOffset( offset, true );
		//
		// MAKE SCALABLE @FIREFOX HACK
		window.setTimeout(function(){ 
			$element.css( 'overflow' , 'visible' );
		    }, animationTime*2 );
		
		
		return VC;
	    };
	        

	    VC.setContainerOffset = function( percent, animate ){ 
		$container.removeClass("animate");

		if(animate) {
		    $container.addClass("animate");
		}
		if(Modernizr.csstransforms3d) {
		    $container.css("transform", "translate3d(0,"
				   + percent +"%,0) scale3d(1,1,1)");
		}
		else if(Modernizr.csstransforms) {
		    $container.css("transform", "translate(0,"
				   + percent +"%)");
		}
		else {
		    //
		    var px = (( paneHeight * paneCount ) / 100) * percent;
		    //
		    $container.css("top", px+"px");
		}
	    };
	        

	    VC.next = function(){ 
		// 
		return VC.showPane( currentPane + 1 );
		//
	    };

	    VC.prev = function(){ 
		//
		return VC.showPane( currentPane - 1);
		//
	    };
	    
	    var handleTouch = function( ev ){ 
		//
		// disable browser scrolling
		ev.gesture.preventDefault();

		switch(ev.type) {
                case 'dragup':
                case 'dragdown':

                    // stick to the finger
                    var pane_offset = -(100/paneCount)*currentPane;
                    var drag_offset = ((100/paneHeight)*ev.gesture.deltaY)/ paneCount;
		    //
                    // slow down at the first and last pane
                    if((currentPane == 0 && 
			ev.gesture.direction == Hammer.DIRECTION_DOWN ) ||
		       (currentPane == paneCount-1 &&
			ev.gesture.direction == Hammer.DIRECTION_UP )) {
                        drag_offset *= .4;
                    }
		    //
                    VC.setContainerOffset(drag_offset + pane_offset);
		    //
		    break;

                case 'swipeup':
                    VC.next();
                    ev.gesture.stopDetect();
                    break;

                case 'swipedown':
                    VC.prev();
                    ev.gesture.stopDetect();
                    break;

                case 'release':
                    // more then 50% moved, navigate
                    if(Math.abs(ev.gesture.deltaY) > paneHeight/2) {
                        if(ev.gesture.direction === 'down') {
			    //
                            VC.prev();
			    //
                        } else {
			    //
                            VC.next();
			    //
                        }
                    }
                    else {
			//
                        VC.showPane(currentPane, true);
			//
                    }
                    break;
		}
	    };
	    
	    var handleScroll = function( e ){ 
		//
		var $this = $(this),
		timeNow = new Date().getTime();
		
		//console.log( e );

		console.log( 'you scrolled over'+e.target );
		//console.log( $this );

		if ( lastAnimationTime + animationTime >= timeNow ){ 
		    //
		    // leave function as the slide is still adjusting
		    e.preventDefault();
		    e.stopPropagation();
		    return;
		    //
		} else { 
		    //
		    if ( $this.scrollTop() >= 1 ){
			e.preventDefault();
			e.stopPropagation();
			//
			console.log( 'this happening?' ) 
			$element.css( 'overflow' , 'hidden' );
			VC.next();
			//
			lastAnimationTime = timeNow;
			//
		    } else if ( $this.scrollTop() <= -1){ 
			e.preventDefault();
			e.stopPropagation();
			//
			VC.prev();
			//
			lastAnimationTime = timeNow;
			//
		    };
		    
		}
	    };
	    
	    // activate the carousel event handler for the desktop
	    $(window).scroll( handleScroll );
	    //
	    // activate the carousel event handler for mobile
	    $element.hammer({ drag_to_lock_target : true })
	    .on( 'release dragdown dragup swipeleft swiperight swipeup swipedown',
		 handleTouch );
	    //
	    return VC;
	    //
	};//verticalCarousel
	
	var Carousel = VerticalCarousel( '#carousel' );
	Carousel.init();
	
    });// end 
