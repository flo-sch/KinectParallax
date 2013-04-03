// jquery.KinectParallax.js
// 2.0
// Stephen Band
//
// Project and documentation site:
// webdev.stephband.info/jKinectParallax/
//
// Repository:
// github.com/stephband/jKinectParallax

(function(jQuery, undefined) {
	// VAR
	var debug = true,
	    
	    options = {
	    	mouseport:     'body',  // jQuery object or selector of DOM node to use as mouseport
	    	xKinectParallax:     true,    // boolean | 0-1 | 'npx' | 'n%'
	    	yKinectParallax:     true,    //
	    	xorigin:       0.5,     // 0-1 - Sets default alignment. Only has effect when KinectParallax values are something other than 1 (or true, or '100%')
	    	yorigin:       0.5,     //
	    	decay:         0.66,    // 0-1 (0 instant, 1 forever) - Sets rate of decay curve for catching up with target mouse position
	    	frameDuration: 30,      // Int (milliseconds)
	    	freezeClass:   'freeze' // String - Class added to layer when frozen
	    },
	
	    value = {
	    	left: 0,
	    	top: 0,
	    	middle: 0.5,
	    	center: 0.5,
	    	right: 1,
	    	bottom: 1
	    },
	
	    rpx = /^\d+\s?px$/,
	    rpercent = /^\d+\s?%$/,
	    
	    win = jQuery(window),
	    doc = jQuery(document),
	    mouse = [0, 0];
	
	var Timer = (function(){
		var debug = false;
		
		// Shim for requestAnimationFrame, falling back to timer. See:
		// see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		var requestFrame = (function(){
		    	return (
		    		window.requestAnimationFrame ||
		    		window.webkitRequestAnimationFrame ||
		    		window.mozRequestAnimationFrame ||
		    		window.oRequestAnimationFrame ||
		    		window.msRequestAnimationFrame ||
		    		function(fn, node){
		    			return window.setTimeout(function(){
		    				fn();
		    			}, 25);
		    		}
		    	);
		    })();
		
		function Timer() {
			var callbacks = [],
				nextFrame;
			
			function noop() {}
			
			function frame(){
				var cbs = callbacks.slice(0),
				    l = cbs.length,
				    i = -1;
				
				if (debug) { console.log('timer frame()', l); }
				
				while(++i < l) { cbs[i].call(this); }
				requestFrame(nextFrame);
			}
			
			function start() {
				if (debug) { console.log('timer start()'); }
				this.start = noop;
				this.stop = stop;
				nextFrame = frame;
				requestFrame(nextFrame);
			}
			
			function stop() {
				if (debug) { console.log('timer stop()'); }
				this.start = start;
				this.stop = noop;
				nextFrame = noop;
			}
			
			this.callbacks = callbacks;
			this.start = start;
			this.stop = stop;
		}

		Timer.prototype = {
			add: function(fn) {
				var callbacks = this.callbacks,
				    l = callbacks.length;
				
				// Check to see if this callback is already in the list.
				// Don't add it twice.
				while (l--) {
					if (callbacks[l] === fn) { return; }
				}
				
				this.callbacks.push(fn);
				if (debug) { console.log('timer add()', this.callbacks.length); }
			},
		
			remove: function(fn) {
				var callbacks = this.callbacks,
				    l = callbacks.length;
				
				// Remove all instances of this callback.
				while (l--) {
					if (callbacks[l] === fn) { callbacks.splice(l, 1); }
				}
				
				if (debug) { console.log('timer remove()', this.callbacks.length); }
				
				if (callbacks.length === 0) { this.stop(); }
			}
		};
		
		return Timer;
	})();
	
	function parseCoord(x) {
		return (rpercent.exec(x)) ? parseFloat(x)/100 : x;
	}
	
	function parseBool(x) {
		return typeof x === "boolean" ? x : !!( parseFloat(x) ) ;
	}
	
	function portData(port) {
		var events = {
		    	'headstart': headstart,
		    	'headstop': headstop
		    },
		    winEvents = {
		    	'resize': resize
		    },
		    data = {
		    	elem: port,
		    	events: events,
		    	winEvents: winEvents,
		    	timer: new Timer()
		    },
		    layers, size, offset;
		
		function updatePointer() {
			data.pointer = getPointer(mouse, [true, true], offset, size);
		}
		
		function resize() {
			size = getSize(port);
			offset = getOffset(port);
			data.threshold = getThreshold(size);
		}
		
		function headstart() {
			data.timer.add(updatePointer);
		}
		
		function headstop(e) {
			data.timer.remove(updatePointer);
			data.pointer = getPointer([e.pageX, e.pageY], [true, true], offset, size);
		}

		win.on(winEvents);
		port.on(events);
		
		resize();
		
		return data;
	}
	
	function getData(elem, name, fn) {
		var data = elem.data(name);
		
		if (!data) {
			data = fn ? fn(elem) : {} ;
			elem.data(name, data);
		}
		
		return data;
	}
	
	function getPointer(mouse, KinectParallax, offset, size){
		var pointer = [],
		    x = 2;
		
		while (x--) {
			pointer[x] = (mouse[x] - offset[x]) / size[x] ;
			pointer[x] = pointer[x] < 0 ? 0 : pointer[x] > 1 ? 1 : pointer[x] ;
		}
		
		return pointer;
	}
	
	function getSize(elem) {
		return [elem.width(), elem.height()];
	}
	
	function getOffset(elem) {
		var offset = elem.offset() || {left: 0, top: 0},
			borderLeft = elem.css('borderLeftStyle') === 'none' ? 0 : parseInt(elem.css('borderLeftWidth'), 10),
			borderTop = elem.css('borderTopStyle') === 'none' ? 0 : parseInt(elem.css('borderTopWidth'), 10),
			paddingLeft = parseInt(elem.css('paddingLeft'), 10),
			paddingTop = parseInt(elem.css('paddingTop'), 10);
		
		return [offset.left + borderLeft + paddingLeft, offset.top + borderTop + paddingTop];
	}
	
	function getThreshold(size) {
		return [1/size[0], 1/size[1]];
	}
	
	function layerSize(elem, x, y) {
		return [x || elem.outerWidth(), y || elem.outerHeight()];
	}
	
	function layerOrigin(xo, yo) {
		var o = [xo, yo],
			i = 2,
			origin = [];
		
		while (i--) {
			origin[i] = typeof o[i] === 'string' ?
				o[i] === undefined ?
					1 :
					value[origin[i]] || parseCoord(origin[i]) :
				o[i] ;
		}
		
		return origin;
	}
	
	function layerPx(xp, yp) {
		return [rpx.test(xp), rpx.test(yp)];
	}
	
	function layerKinectParallax(xp, yp, px) {
		var p = [xp, yp],
		    i = 2,
		    KinectParallax = [];
		
		while (i--) {
			KinectParallax[i] = px[i] ?
				parseInt(p[i], 10) :
				KinectParallax[i] = p[i] === true ? 1 : parseCoord(p[i]) ;
		}
		
		return KinectParallax;
	}
	
	function layerOffset(KinectParallax, px, origin, size) {
		var i = 2,
		    offset = [];
		
		while (i--) {
			offset[i] = px[i] ?
				origin[i] * (size[i] - KinectParallax[i]) :
				KinectParallax[i] ? origin[i] * ( 1 - KinectParallax[i] ) : 0 ;
		}
		
		return offset;
	}
	
	function layerPosition(px, origin) {
		var i = 2,
		    position = [];
		
		while (i--) {
			if (px[i]) {
				// Set css position constant
				position[i] = origin[i] * 100 + '%';
			}
			else {
			
			}
		}
		
		return position;
	}
	
	function layerPointer(elem, KinectParallax, px, offset, size) {
		var viewport = elem.offsetParent(),
			pos = elem.position(),
			position = [],
			pointer = [],
			i = 2;
		
		// Reverse calculate ratio from elem's current position
		while (i--) {
			position[i] = px[i] ?
				// TODO: reverse calculation for pixel case
				0 :
				pos[i === 0 ? 'left' : 'top'] / (viewport[i === 0 ? 'outerWidth' : 'outerHeight']() - size[i]) ;
			
			pointer[i] = (position[i] - offset[i]) / KinectParallax[i] ;
		}
		
		return pointer;
	}
	
	function layerCss(KinectParallax, px, offset, size, position, pointer) {
		var pos = [],
		    cssPosition,
		    cssMargin,
		    x = 2,
		    css = {};
		
		while (x--) {
			if (KinectParallax[x]) {
				pos[x] = KinectParallax[x] * pointer[x] + offset[x];
				
				// We're working in pixels
				if (px[x]) {
					cssPosition = position[x];
					cssMargin = pos[x] * -1;
				}
				// We're working by ratio
				else {
					cssPosition = pos[x] * 100 + '%';
					cssMargin = pos[x] * size[x] * -1;
				}
				
				// Fill in css object
				if (x === 0) {
					css.left = cssPosition;
					css.marginLeft = cssMargin;
				}
				else {
					css.top = cssPosition;
					css.marginTop = cssMargin;
				}
			}
		}
		
		return css;
	}
	
	function pointerOffTarget(targetPointer, prevPointer, threshold, decay, KinectParallax, targetFn, updateFn) {
		var pointer, x;
		
		if ((!KinectParallax[0] || Math.abs(targetPointer[0] - prevPointer[0]) < threshold[0]) &&
		    (!KinectParallax[1] || Math.abs(targetPointer[1] - prevPointer[1]) < threshold[1])) {
		    // Pointer has hit the target
		    if (targetFn) { targetFn(); }
		    return updateFn(targetPointer);
		}
		
		// Pointer is nowhere near the target
		pointer = [];
		x = 2;
		
		while (x--) {
			if (KinectParallax[x]) {
				pointer[x] = targetPointer[x] + decay * (prevPointer[x] - targetPointer[x]);
			}
		}
			
		return updateFn(pointer);
	}
	
	function pointerOnTarget(targetPointer, prevPointer, threshold, decay, KinectParallax, targetFn, updateFn) {
		// Don't bother updating if the pointer hasn't changed.
		if (targetPointer[0] === prevPointer[0] && targetPointer[1] === prevPointer[1]) {
			return;
		}
		
		return updateFn(targetPointer);
	}
	
	function unport(elem, events, winEvents) {
		elem.off(events).removeData('KinectParallax_port');
		win.off(winEvents);
	}
	
	function unKinectParallax(node, port, events) {
		port.elem.off(events);
		
		// Remove this node from layers
		port.layers = port.layers.not(node);
		
		// If port.layers is empty, destroy the port
		if (port.layers.length === 0) {
			unport(port.elem, port.events, port.winEvents);
		}
	}
	
	function unstyle(KinectParallax) {
		var css = {};
		
		if (KinectParallax[0]) {
			css.left = '';
			css.marginLeft = '';
		}
		
		if (KinectParallax[1]) {
			css.top = '';
			css.marginTop = '';
		}
		
		elem.css(css);
	}
	
	jQuery.fn.KinectParallax = function(o){
		var options = jQuery.extend({}, jQuery.fn.KinectParallax.options, o),
		    args = arguments,
		    elem = options.mouseport instanceof jQuery ? options.mouseport : jQuery(options.mouseport),
		    port = getData(elem, 'KinectParallax_port', portData),
		    timer = port.timer;
		
		return this.each(function(i) {
			var node      = this,
			    elem      = jQuery(this),
			    opts      = args[i + 1] ? jQuery.extend({}, options, args[i + 1]) : options,
			    decay     = opts.decay,
			    size      = layerSize(elem, opts.width, opts.height),
			    origin    = layerOrigin(opts.xorigin, opts.yorigin),
			    px        = layerPx(opts.xKinectParallax, opts.yKinectParallax),
			    KinectParallax  = layerKinectParallax(opts.xKinectParallax, opts.yKinectParallax, px),
			    offset    = layerOffset(KinectParallax, px, origin, size),
			    position  = layerPosition(px, origin),
			    pointer   = layerPointer(elem, KinectParallax, px, offset, size),
			    pointerFn = pointerOffTarget,
			    targetFn  = targetInside,
			    events = {
			    	'headstart': function headstart(e) {
			    		console.log('headstart', this, e);
			    		pointerFn = pointerOffTarget;
			    		targetFn = targetInside;
			    		timer.add(frame);
			    		timer.start();
			    	},
			    	'headstop': function headstop(e) {
			    		console.log('headstop', e);
			    		// Make the layer come to rest at it's limit with inertia
			    		pointerFn = pointerOffTarget;
			    		// Stop the timer when the the pointer hits target
			    		targetFn = targetOutside;
			    	}
			    };

			function updateCss(newPointer) {
				var css = layerCss(KinectParallax, px, offset, size, position, newPointer);
				elem.css(css);
				pointer = newPointer;
			}
			
			function frame() {
				pointerFn(port.pointer, pointer, port.threshold, decay, KinectParallax, targetFn, updateCss);
			}
			
			function targetInside() {
				// Pointer hits the target pointer inside the port
				pointerFn = pointerOnTarget;
			}
			
			function targetOutside() {
				// Pointer hits the target pointer outside the port
				timer.remove(frame);
			}

			
			
			if (jQuery.data(node, 'KinectParallax')) {
				elem.unKinectParallax();
			}
			
			jQuery.data(node, 'KinectParallax', {
				port: port,
				events: events,
				KinectParallax: KinectParallax
			});
			
			port.elem.on(events);
			port.layers = port.layers? port.layers.add(node): jQuery(node);
			
			/*function freeze() {
				freeze = true;
			}
			
			function unfreeze() {
				freeze = false;
			}*/
			
			/*jQuery.event.add(this, 'freeze.KinectParallax', freeze);
			jQuery.event.add(this, 'unfreeze.KinectParallax', unfreeze);*/
		});
	};
	
	jQuery.fn.unKinectParallax = function(bool) {
		return this.each(function() {
			var data = jQuery.data(this, 'KinectParallax');
			
			// This elem is not KinectParallaxed
			if (!data) { return; }
			
			jQuery.removeData(this, 'KinectParallax');
			unKinectParallax(this, data.port, data.events);
			if (bool) { unstyle(data.KinectParallax); }
		});
	};

	jQuery.fn.KinectParallax.options = options;
	
	doc.on('headmove', function (e, position) {
		mouse = [position.posx, position.posy];
	});

	jQuery(document).on('headstart', function (e) {
		console.log('HEADSTART', e, port);
		port.elem.trigger('headstart', e);
	});
	jQuery(document).on('headstop', function (e) {
		console.log('HEADSTOP', e);
		port.elem.trigger('headstop', e);
	});
	
	// Pick up and store mouse position on document: IE does not register
	// mousemove on window.
	doc.on('mousemove.KinectParallax', function(e) {
		//console.log('mousemove', e);
		//mouse = [e.pageX, e.pageY];
	});
}(jQuery));