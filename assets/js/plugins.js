// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

// HELPERS / PLUGINS CONFIG //

// requestAnimationFrame polyfill from Erik Möller - Opera developer
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
window.RAF = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
if (!window.RAF) {
	var lastTime = 0;
	window.RAF = function (callback, element) {
		var currTime = new Date().getTime(),
			timeToCall = Math.max(0, 16 - (currTime - lastTime)),
			id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
		return id;
	};
}
window.CRAF = window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame;
if (!window.CRAF) {
	window.CRAF = function(id) {
        clearTimeout(id);
    };
}

// Hide zigfu advertising element
$(document).ready(function () {
	var $zigfuLink,
		checkInterval = setInterval(function () {
			$zigfuLink = $('div').find('a[href="http://zigfu.com/watermark"]');
			if ($zigfuLink.length > 0) {
				// Zigfu REQUIRE this element to be visible... ?!
				$zigfuLink.parent().css({
					'width': '1px',
					'height': '1px',
					'overflow': 'hidden'
				});
				clearInterval(checkInterval);
			}
		}, 50);
});