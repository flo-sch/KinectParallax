(function($) {
	var debug = true,
		defaults = {
			'viewport': $('body'),
			'axisXAllowed': true,
			'axisYAllowed': true,
			'axisZ': 100
		},
		KPmethods = {
			start: function (position) {
				return this.each(function () {
					var $data = $(this).data('KinectParallax');
					$data.bind = true;
					$data.cameraInit = {
						'x': position.x,
						'y': position.y,
						'z': position.z
					}
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
							x = ($data.axisXAllowed ? $data.init.left - (position.x * $data.movement.axisZ) : x);
							y = ($data.axisYAllowed ? $data.init.top + (position.y * $data.movement.axisZ) * (($data.init.zIndex - $data.axisZ / 2) + 1) / $data.axisZ : y);
						} else if (typeof position === 'array' && position[0] && position[1]) {
							x = ($data.axisXAllowed ? $data.init.left - (position[0] * $data.movement.axisZ) : x);
							y = ($data.axisYAllowed ? $data.init.top + (position[1] * $data.movement.axisZ) * (($data.init.zIndex - $data.axisZ / 2) + 1) / $data.axisZ : y);
						} else if (debug) {
							console.log('Unable to set the new position: ', position);
						}
						$data.coords = {
							'x': Math.min(Math.max(x, $data.movement.minLeft), $data.movement.maxLeft),
							'y': Math.min(Math.max(y, $data.movement.minTop), $data.movement.maxTop),
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
					var $node = $(this),
						layerWidth = parseInt($node.outerWidth()),
						layerHeight = parseInt($node.outerHeight()),
						diffTop = parseInt(options.viewport.outerHeight()) - layerHeight,
						diffLeft = parseInt(options.viewport.outerWidth()) - layerWidth,
						initialPosition = $node.position(),
						minLeft = Math.min(diffLeft, 0),
						maxLeft = Math.max(diffLeft, 0),
						minTop = Math.min(diffTop, 0),
						maxTop = Math.max(diffTop, 0) + initialPosition.top,
						axisZ = parseInt($node.css('z-index')) / options.axisZ;

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
							'x': initialPosition.left,
							'y': initialPosition.top
						},
						'movement': {
							'minLeft': minLeft,
							'maxLeft': maxLeft,
							'minTop': minTop,
							'maxTop': maxTop,
							'axisZ': axisZ,
						},
						'init': {
							'left': initialPosition.left,
							'top': initialPosition.top,
							'zIndex': $node.css('z-index')
						},
						'cameraInit': {
							'x': null,
							'y': null,
							'z': null
						},
						'bind': false
	           		});
				});
			}
		};
	$.fn.KinectParallax = function (method) {
		if (KPmethods[method]) {
			return KPmethods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return KPmethods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.KinectParallax');
		}
	};
	$.fn.KinectParallax.options = defaults;
})(window.jQuery);