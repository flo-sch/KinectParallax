(function($) {
	var debug = true,
		coords = {
			x: 0,
			y: 0
		},
		defaults = {
			axisX: true,
			axisY: true,
			frame: 100 // Milliseconds
		},
		$doc = $(document),
		$win = $(window),
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
			init: function(options) {
				console.log('init', this, options);
				return this.each(function() {
					$node = $(this);
					$node.data('KinectParallax', {
		               'target' : $node,
		               'options': options,
		               'version': '0.0.1',
		               'bind': false
		           });
				});
			},
			move: function (position) {
				console.log(typeof position);
				return this.each(function () {
					$data = $(this).data('KinectParallax');
					if ($data.bind) {
						var x = coords.x,
							y = coords.y,
							width = $(this).outerWidth();
						if (typeof position === 'object' && position.x && position.y) {
							x = position.x;
							y = position.y;
						} else if (typeof position === 'array' && position[0] && position[1]) {
							x = position[0];
							y = position[1];
						} else if (debug) {
							console.log('Unable to set the new position: ', position);
						}
						coords = {
							'x': x,
							'y': y
						}

						$(this).css('left', (coords.x - width / 2) * 0.5);
					}
				});
			},
			destroy: function() {

			}
		};
	$.fn.KinectParallax = function( method ) {
		if ( KPmethods[method] ) {
			return KPmethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return KPmethods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.KinectParallax' );
		}
	};
	$.fn.KinectParallax.options = defaults;
})(window.jQuery);