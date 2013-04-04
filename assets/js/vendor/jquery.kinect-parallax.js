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
					console.log('INIT Y', position.y, $data.movement.minTop);
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
							y = ($data.axisYAllowed ? ((position.y - $data.cameraInit.y) * (($data.init.zIndex - $data.axisZ / 2) + 1) / $data.axisZ) : y);
							console.log('Relative Y position', position.y - $data.cameraInit.y, 'Rapport axisZ', (($data.init.zIndex - $data.axisZ / 2) + 1) / $data.axisZ, 'top value', y);
						} else if (typeof position === 'array' && position[0] && position[1]) {
							x = ($data.axisXAllowed ? - ((position[0] * $data.movement.axisZ) - $data.movement.minLeft / 2) : x);
							y = ($data.axisYAllowed ? $data.init.top - ((position[1] * $data.movement.axisZ) - $data.movement.minTop / 2) : y);
						} else if (debug) {
							console.log('Unable to set the new position: ', position);
						}
						$data.coords = {
							'x': Math.min(Math.max(x, $data.movement.minLeft), 0),
							'y': Math.max(y, $data.movement.minTop)//Math.min(Math.max(y, $data.movement.minTop), 0)
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
							'x': $node.position().left,
							'y': $node.position().top
						},
						'movement': {
							'minLeft': minLeft,
							'minTop': minTop,
							'axisZ': axisZ,
						},
						'init': {
							'left': $node.position().left,
							'top': $node.position().top,
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
			return KPmethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || !method) {
			return KPmethods.init.apply( this, arguments );
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.KinectParallax');
		}
	};
	$.fn.KinectParallax.options = defaults;
})(window.jQuery);