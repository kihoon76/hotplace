$(document).ready(function () {
	// $.curCSS is not a function 오류처리
	jQuery.curCSS = function(element, prop, val) {
	    return jQuery(element).css(prop, val);
	};
	
	// Cannot read property 'msie' of undefined 오류처리
	jQuery.browser = {};
	
	jQuery.browser.msie = false;
	jQuery.browser.version = 0;
	
	if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
		jQuery.browser.msie = true;
	    jQuery.browser.version = RegExp.$1;
	}
});



