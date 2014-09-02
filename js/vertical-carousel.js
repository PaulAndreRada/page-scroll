$(function(){ 
	// @carousel
	
	var VerticalCarousel = function( element ){ 
	        
	    var VC = {},
	    $doc = $( document ),
	    $element = $doc.find( element ), // div on top of rails
	    $container = $element.find( 'ul' ), // would be rails
	    $panes = $container.find( 'li' ), // sections
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
		return VC;
	    };
	        

	    VC.setContainerOffset = function( percent, animate ){ 
		$container.removeClass("animate");

		if(animate) {
		    $container.addClass("animate");
		}
		if(Modernizr.csstransforms3d) {
		    $container.css("transform", "translate3d(0,"+ percent +"%,0) scale3d(1,1,1)");
		}
		else if(Modernizr.csstransforms) {
		    $container.css("transform", "translate(0,"+ percent +"%)");
		}
		else {
		    var px = (( paneHeight * paneCount ) / 100) * percent;
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
                    var drag_offset = ((100/paneHeight)*ev.gesture.deltaY) / paneCount;
		    console.log( ev.gesture.deltaY );
		    //
                    // slow down at the first and last pane
                    if((currentPane == 0 && ev.gesture.direction == Hammer.DIRECTION_DOWN ) ||
		       (currentPane == paneCount-1 && ev.gesture.direction == Hammer.DIRECTION_UP )) {
                        drag_offset *= .4;
                    }
		    
                    VC.setContainerOffset(drag_offset + pane_offset);
		    
		    console.log( 'drag' );
		    console.log( 'setOffset' );

                    break;

                case 'swipeup':
                    VC.next();
                    ev.gesture.stopDetect();
		    console.log( 'swipeUp' );
		    console.log( 'next' );
                    break;

                case 'swipedown':
                    VC.prev();
                    ev.gesture.stopDetect();
		    console.log( 'swipeDown' );
		    console.log( 'prev' );
                    break;

                case 'release':
                    // more then 50% moved, navigate
                    if(Math.abs(ev.gesture.deltaY) > paneHeight/2) {
                        if(ev.gesture.direction === 'down') {
                            VC.prev();
			    console.log( 'release' );
			    console.log( 'prev' );

                        } else {
			    console.log( 'release' );
			    console.log( 'next' );
                            VC.next();
                        }
                    }
                    else {
                        VC.showPane(currentPane, true);
			console.log( 'else' );
			console.log( 'show pane' );
                    }
                    break;
		}
		console.log( 'currentPane :'+currentPane );
	    };
	    

	    // FIGURE ME OUT!
	    // activate the carousel event handler for the desktop
	    $(window).scroll( function(e){ 
		    //
		    var $this = $(this),
			timeNow = new Date().getTime();
		    
		    //console.log( 'timeNow : ' + timeNow );
		    if ( lastAnimationTime + animationTime >= timeNow ){ 
			// leave function as the slide is still adjusting
			e.preventDefault();
			e.stopPropagation();
			return console.log( 'cancel scroll' );
		    } else { 

			if ( $this.scrollTop() === 1 ){
			    e.preventDefault();
			    e.stopPropagation();
			    VC.next();
			    lastAnimationTime = timeNow;

			} else if ( $this.scrollTop() === -1){ 
			    e.preventDefault();
			    e.stopPropagation();
			    VC.prev();
			    lastAnimationTime = timeNow;

			} else {
			    console.log( $(this).scrollTop() );
			};
		    };
		    
	    });
	    //
	    // activate the carousel event handler for mobile
	    $element.hammer({ drag_to_lock_target : true })
	    .on( 'release dragdown dragup swipeleft swiperight swipeup swipedown', handleTouch );
	    //
	    
	    return VC;
	    //
	};//verticalCarousel


       
	var vertTest = VerticalCarousel( '#carousel' );
	
	console.log( vertTest );
	
	vertTest.init();


    });
