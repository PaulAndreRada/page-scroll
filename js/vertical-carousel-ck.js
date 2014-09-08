/*------------------------------------------------*//*  Credit: Eike Send for the swipe event *//*------------------------------------------------*//*
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
*///@carousel
$(function(){var e=function(e){var t={},n=$(document),r=n.find(e),i=r.find("ul"),s=i.find("li"),o=0,u=s.length,a=0,f=450,l=1e3,c=0;t.init=function(){t.setPaneDimensions();$(window).on("load resize orientationchange",function(){t.setPaneDimensions()});return t};t.setPaneDimensions=function(){o=r.height();for(var e=0;e<u;e++)s.height(o);i.height(o*u);return t};t.showPane=function(e){var e=Math.max(0,Math.min(e,u-1));a=e;var n=-(100/u*a);t.setContainerOffset(n,!0);return t};t.setContainerOffset=function(e,t){i.removeClass("animate");t&&i.addClass("animate");if(Modernizr.csstransforms3d)i.css("transform","translate3d(0,"+e+"%,0) scale3d(1,1,1)");else if(Modernizr.csstransforms)i.css("transform","translate(0,"+e+"%)");else{var n=o*u/100*e;i.css("top",n+"px")}};t.next=function(){return t.showPane(a+1)};t.prev=function(){return t.showPane(a-1)};var h=function(e,n){var r=$(this),i=n,s=(new Date).getTime(),o=s-c,u=f+l,a=r.scrollTop();if(o<u){e.preventDefault();return}i<0?t.next():t.prev();c=s};n.bind("mousewheel DOMMouseScroll MozMousePixelScroll",function(e){e.preventDefault();var t=e.originalEvent.wheelDelta||-e.originalEvent.detail;h(e,t)});var p=function(e){e.gesture.preventDefault();switch(e.type){case"dragup":case"dragdown":var n=-(100/u)*a,r=100/o*e.gesture.deltaY/u;if(a==0&&e.gesture.direction==Hammer.DIRECTION_DOWN||a==u-1&&e.gesture.direction==Hammer.DIRECTION_UP)r*=.4;t.setContainerOffset(r+n);break;case"swipeup":t.next();e.gesture.stopDetect();break;case"swipedown":t.prev();e.gesture.stopDetect();break;case"release":Math.abs(e.gesture.deltaY)>o/2?e.gesture.direction==="down"?t.prev():t.next():t.showPane(a,!0)}};r.hammer({drag_to_lock_target:!0}).on("release dragdown dragup swipeleft swiperight swipeup swipedown",p);return t},t=e("#carousel");t.init()});