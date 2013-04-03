(function($) {
	var debug = true,
		defaults = {
			'viewport': $('body'),
			'axisXAllowed': true,
			'axisYAllowed': true,
			'axisZ': 100
		},
		KPmethods = {
			start: function () {
				return this.each(function () {
					var $data = $(this).data('KinectParallax');
					$data.bind = true;
					$(this).data('KinectParallax', $data);
				})
			},
			stop: function () {
				return this.each(function () {
					var $data = $(this).data('KinectParallax');
					$data.bind = false;
					$(this).data('KinectParallax', $data);
				});
			},
			move: function (position) {
				return this.each(function () {
					$data = $(this).data('KinectParallax');
					if ($data.bind) {
						var x = $data.coords.x,
							y = $data.coords.y,
							css;
						if (typeof position === 'object' && position.x && position.y) {
							x = ($data.axisXAllowed ? - ((position.x * $data.movement.axisZ) - $data.movement.minLeft / 2) : x);
							y = ($data.axisYAllowed ? - ((position.y * $data.movement.axisZ) - $data.movement.minTop / 2) : y);
						} else if (typeof position === 'array' && position[0] && position[1]) {
							x = ($data.axisXAllowed ? - ((position[0] * $data.movement.axisZ) - $data.movement.minLeft / 2) : x);
							y = ($data.axisYAllowed ? - ((position[1] * $data.movement.axisZ) - $data.movement.minTop / 2) : y);
						} else if (debug) {
							console.log('Unable to set the new position: ', position);
						}
						$data.coords = {
							'x': Math.min(Math.max(x, $data.movement.minLeft), 0),
							'y': Math.min(Math.max(y, $data.movement.minTop), 0)
						};
						css = {
							'left': $data.coords.x,
							'top': $data.coords.y
						};
						$(this).css(css);
					}
				});
			},
			init: function(options) {
				var options = $.extend({}, $.fn.KinectParallax.options, options);
				return this.each(function() {
					var layerWidth = parseInt($(this).outerWidth()),
						layerHeight = parseInt($(this).outerHeight()),
						minLeft = - (layerWidth - parseInt(options.viewport.outerWidth())),
						minTop = layerHeight - parseInt(options.viewport.outerHeight()),
						axisZ = parseInt($(this).css('z-index')) / options.axisZ;
					$node = $(this);
					$node.data('KinectParallax', {
						'target' : $node,
						'layerWidth': layerWidth,
						'layerHeight': layerHeight,
						'viewport': options.viewport,
						'axisXAllowed': options.axisXAllowed,
						'axisYAllowed': options.axisYAllowed,
						'axisZ': options.axisZ,
						'version': '0.0.1',
						'coords': {
							'x': $node.offset().left,
							'y': $node.offset().top
						},
						'movement': {
							'minLeft': minLeft,
							'minTop': minTop,
							'axisZ': axisZ,
						},
						'bind': false
	           		});
					console.log($node.data('KinectParallax'));
				});
			}
		};
	$.fn.KinectParallax = function (method) {
		if (KPmethods[method]) {
			return KPmethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || !method) {
			return KPmethods.init.apply( this, arguments );
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.KinectParallax');
		}
	};
	$.fn.KinectParallax.options = defaults;
})(window.jQuery);