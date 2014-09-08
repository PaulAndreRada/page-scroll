


/*------------------------------------------------*/
/*  Credit: Eike Send for the swipe event */
/*------------------------------------------------*/
/*
// @swipe event
(function($) { 
  $.fn.swipeEvents = function() {
    return this.each(function() {
      
      var startX,
          startY,
          $this = $(this); // no need, its doubling up
      
      $this.bind('touchstart', touchstart);
      
      function touchstart(event) {
        //
        //grab the touches event info
        var touches = event.originalEvent.touches;


        if (touches && touches.length) {
          //
          // grab the matrix information for those events
          startX = touches[0].pageX;
          startY = touches[0].pageY;
          //
          // if touches exist bind touchmove and touch end
          $this.bind('touchmove', touchmove);
          $this.bind('touchend', touchend);
        }
        event.preventDefault();
      }
      
      function touchmove(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          var deltaX = startX - touches[0].pageX;
          var deltaY = startY - touches[0].pageY;
          
          if (deltaX >= 50) {
            $this.trigger("swipeLeft");
          }
          if (deltaX <= -50) {
            $this.trigger("swipeRight");
          }
          if (deltaY >= 50) {
            $this.trigger("swipeUp");
          }
          if (deltaY <= -50) {
            $this.trigger("swipeDown");
          }
          if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
            $this.unbind('touchmove', touchmove);
            $this.unbind('touchend', touchend);
          }
        }
        event.preventDefault();
      }
      
      function touchend(event) {
        $this.unbind('touchmove', touchmove);
        event.preventDefault();
      }
      
    });
  };
})(jQuery);
*/



//@carousel
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
	    quietPeriod = 1000,
	    lastAnimationTime = 0;
	    

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
		//
		return VC;
		//
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
		//
		return VC.showPane( currentPane + 1 );
		//
	    };

	    VC.prev = function(){ 
		//
		//
		return VC.showPane( currentPane - 1);
		//
	    };
	    
	    
	    var handleScroll = function( event, delta ){ 
		//
		var $this = $(this),
		deltaOfInterest = delta,
		timeNow = new Date().getTime(),
		timeElapsed = timeNow - lastAnimationTime,
		waitTime = animationTime + quietPeriod,
		scrollTop = $this.scrollTop();
		//
		//
		// Cancel scroll if currently animating or within quiet period
		if( timeElapsed < waitTime ){
		    //
		    event.preventDefault();
		    //
		    // leave the function
		    return;
		}
		//
		// if delta is negative call prev()
		if (deltaOfInterest < 0) {
		    VC.next()
		} else {
		    VC.prev()
		}
		// set the last animations time
		lastAnimationTime = timeNow;
		//
	    };
	    //	    
	    // @DESKTOP HANDLER
	    // activate the carousel event handler for the desktop
	    // make event handler
	    $doc.bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event) {
		    //
		    event.preventDefault();
		    // 
		    // assing the delta depending on the brower [ webkit and presto || mozilla ]
		    var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
		    //
		    // call scroll function
		    handleScroll(event, delta);
		});
	    

	    	    
	    var handleTouch = function( ev ){ 
		//
		// disable browser scrolling
		ev.gesture.preventDefault();
		//
		switch(ev.type) {
                case 'dragup':
                case 'dragdown':
		    //
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
	    //
	    // @MOBILE HANDLER
	    // activate the carousel event handler for mobile
	    $element.hammer({ drag_to_lock_target : true })
	    .on( 'release dragdown dragup swipeleft swiperight swipeup swipedown',
		 handleTouch );
	    
	    
	    
	    
	    
	    return VC;
	    //
	};//verticalCarousel
	
	var Carousel = VerticalCarousel( '#carousel' );
	Carousel.init();
	
    });// end 
