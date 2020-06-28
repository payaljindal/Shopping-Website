(function ($) { "use strict";
	jQuery(document).ready(function($) {
		var bxsliderProperties = ["mode", "speed", "slideMargin", "startSlide", "randomStart", "slideSelector", "infiniteLoop", "hideControlOnEnd", "easing", "captions", "ticker", "tickerHover", "adaptiveHeight", "adaptiveHeightSpeed", "video", "responsive", "useCSS", "preloadImages", "touchEnabled", "swipeThreshold", "oneToOneTouch", "preventDefaultSwipeX", "preventDefaultSwipeY", "pager", "pagerType", "pagerShortSeparator", "pagerSelector", "pagerCustom", "buildPager", "controls", "nextText", "prevText", "nextSelector", "prevSelector", "autoControls", "startText", "stopText", "autoControlsCombine", "autoControlsSelector", "auto", "pause", "autoStart", "autoDirection", "autoHover", "autoDelay", "minSlides", "maxSlides", "moveSlides", "slideWidth"];
		var bxsliderCallbacks = ["onSliderLoad", "onSlideBefore", "onSlideAfter", "onSlideNext", "onSlidePrev"];
		$('.jm-bxslider').each(function() {

			var $this = $(this), responsiveID = $(this).attr('id');
			var options_setting = {};
			$(bxsliderProperties).each(function() {
				if ($this.data(this.toString().toLowerCase()) != undefined) {
					options_setting[this.toString()] = $this.data(this.toString().toLowerCase());
				}
			});
			$(bxsliderCallbacks).each(function(){
				if($this.data(this.toString().toLowerCase()) != undefined){
					var callback = this.toString();
					options_setting[this.toString()] = function(){
							var funstr = $this.data(callback.toLowerCase());
							var f = new Function (funstr);
							return f();
					}
				}
			});
			var options = jmbxAdjustOptions(options_setting, $this.innerWidth());
			var slide = $this.bxSlider(options);
			var windowW = $(window).width();
			$(window).resize(function() {
				waitForFinalEvent(function() {
					if (windowW == $(window).width())
						return;
					windowW = $(window).width();
					slide.destroySlider();
					options = jmbxAdjustOptions(options_setting, $this.innerWidth());
					slide = $this.bxSlider(options);
				}, 500, responsiveID)
			})
		});
	})

	/*Adjust bxslider options to fix on any screen*/
	function jmbxAdjustOptions(options, container_width) {
		var _options = {};
		jQuery.extend(_options, options);

		if ((_options.slideWidth * _options.maxSlides + (_options.slideMargin * (_options.maxSlides - 1))) < container_width) {
			_options.slideWidth = (container_width - (_options.slideMargin * (_options.maxSlides - 1))) / _options.maxSlides;
		} else {
			_options.maxSlides = Math.floor((container_width - (_options.slideMargin * (_options.maxSlides - 1))) / _options.slideWidth);
			_options.maxSlides = _options.maxSlides == 0 ? 1 : _options.maxSlides;
			_options.slideWidth = (container_width - (_options.slideMargin * (_options.maxSlides - 1))) / _options.maxSlides;
		}
		return _options;
	}
	var waitForFinalEvent = (function() {
		var d = {};
		return function(a, b, c) {
			if (!c) {
				c = "Don't call this twice without a uniqueId"
			}
			if (d[c]) {
				clearTimeout(d[c]);
			}
			d[c] = setTimeout(a, b);
		}
	})();
})(jQuery);
