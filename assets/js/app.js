jQuery(document).on('ready', function () {
	if (zig) {
		var posx = 0,
			posy = 0,
			posz = 0,
			engager = zig.EngageUsersWithSkeleton(1),
			$doc = jQuery(document),
			$headX = jQuery('#head-x'),
			$headY = jQuery('#head-y'),
			$headZ = jQuery('#head-z'),
			$viewport = jQuery('#kinect-parallax'),
			$sunLayer = jQuery('#kinect-parallax-layer-4'),
			$sunInformations = jQuery('#sun-informations').dialog({
				autoOpen: false,
				dialogClass: 'popin',
				width: 500
			}),
			handSession = {
				'$el': jQuery('#cursor'),
				'cursor': zig.controls.Cursor()
			},
			cursorAreaWidth = $viewport.width() - handSession.$el.width(),
			cursorAreaHeight = $viewport.height() - handSession.$el.height(),
			sunArea = new Polygon([
				[0.35 * cursorAreaWidth, 0.05 * cursorAreaHeight],
				[0.35 * cursorAreaWidth, 0.25 * cursorAreaHeight],
				[0.55 * cursorAreaWidth, 0.25 * cursorAreaHeight],
				[0.55 * cursorAreaWidth, 0.05 * cursorAreaHeight]
			]),
			HoverTimer = (function () {
				function Timer(delay, callback) {
					this.timeout = null;
					this.delay = delay * 1000;
					this.callback = callback;
					this.callbackArgs = Array.prototype.slice.call(arguments, 2);
				}
				Timer.prototype = {
					isStarted: function () {
						return (this.timeout !== null);
					},
					start: function () {
						var self = this;
						this.timeout = setTimeout(function () {
							self.callback.apply(self, self.callbackArgs);
						}, self.delay);
					},
					launch: function () {
						if (this.isStarted() === false) {
							this.start();
						}
					},
					stop: function () {
						clearTimeout(this.timeout);
						this.timeout = null;
					},
					cancel: function () {
						if (this.isStarted() === true) {
							this.stop();
						}
					}
				};
				return Timer;
			})(),
			handSessionDetector,
			handEvents = {
				onattach: function (user) {
					console.log('attach', user);
				},
				onsessionstart: function (e) {
					handSession.$el.show();
					var hoverTimer = new HoverTimer(1.5, function () {
						$sunLayer.trigger('hover');
					});
					handSession.cursor.addEventListener('move', function (cursor) {
						handSession.$el.css({
							'left': cursor.x * cursorAreaWidth,
							'top': cursor.y * cursorAreaHeight
						});
						// Bind hover on custom Area
						var point = new Point(cursor.x * cursorAreaWidth, cursor.y * cursorAreaHeight);
						if (sunArea.contains(point)) {
							hoverTimer.launch();
							handSession.$el.addClass('hover');
						} else {
							hoverTimer.cancel();
							handSession.$el.removeClass('hover');
						}
					});
				},
				onsessionend: function (e) {
					handSession.$el.hide();
				},
				ondetach: function (user) {
					console.log('detach', user);
				}
			},
			pushDetector,
			pushEvents = {
				onpush: function (pushEvent) {
					handSession.$el.addClass('active');
				},
				onrelease: function (releaseEvent) {
					// Trigger something
					$doc.trigger('push', {
						'position': releaseEvent.pushPosition
					});
					handSession.$el.removeClass('active');
				},
				onclick: function (clickEvent) {

				}
			},
			swipeDetector,
			swipeEvents = {
				swipe: function (swipeEvent) {
					console.log('swipe', swipeEvent);
				},
				swipeup: function (swipeEvent) {
					console.log('swipeUp', swipeEvent);
					$sunInformations.dialog('close');
				},
				swipedown: function (swipeEvent) {
					console.log('swipeDown', swipeEvent);
					$sunInformations.dialog('close');
				},
				swipeleft: function (swipeEvent) {
					console.log('swipeLeft', swipeEvent);
					$sunInformations.dialog('close');
				},
				swiperight: function (swipeEvent) {
					console.log('swipeRight', swipeEvent);
					$sunInformations.dialog('close');
				},
				swiperelease: function (swipeEvent) {
					console.log('swipe release', swipeEvent);
				}
			},
			onUserMove = function(user) {
				posx = user.skeleton[zig.Joint.Head].position[0];
				posy = user.skeleton[zig.Joint.Head].position[1];
				posz = user.skeleton[zig.Joint.Head].position[2];
				$headX.text(posx);
				$headY.text(posy);
				$headZ.text(posz);
				$doc.trigger('headmove', {
					'x': posx,
					'y': posy,
					'z': posz
				});
			},
			hideZigfuElement = function () {
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
			};

		hideZigfuElement();

		engager.addEventListener('userengaged', function(user) {
			user.addEventListener('userupdate', onUserMove);

			handSessionDetector = zig.HandSessionDetector();
			handSessionDetector.addListener(handEvents);
			handSessionDetector.addListener(handSession.cursor);

			pushDetector = zig.controls.PushDetector();
			pushDetector.addEventListener('push', pushEvents.onpush);
			pushDetector.addEventListener('release', pushEvents.onrelease);
			pushDetector.addEventListener('click', pushEvents.onclick);
			handSessionDetector.addListener(pushDetector);

			swipeDetector = zig.controls.SwipeDetector();
			swipeDetector.addEventListener('swipe', swipeEvents.swipe);
			swipeDetector.addEventListener('swipeup', swipeEvents.swipeup);
			swipeDetector.addEventListener('swipedown', swipeEvents.swipedown);
			swipeDetector.addEventListener('swipeleft', swipeEvents.swipeleft);
			swipeDetector.addEventListener('swiperight', swipeEvents.swiperight);
			swipeDetector.addEventListener('swiperelease', swipeEvents.swiperelease);
			handSessionDetector.addListener(swipeDetector);
			
			user.addListener(handSessionDetector);

			posx = user.skeleton[zig.Joint.Head].position[0];
			posy = user.skeleton[zig.Joint.Head].position[1];
			posz = user.skeleton[zig.Joint.Head].position[2];
			$doc.trigger('headstart', {
				'x': posx,
				'y': posy,
				'z': posz
			});
		});

		engager.addEventListener('userdisengaged', function(user) {
			user.removeEventListener('userupdate', onUserMove);
			$doc.trigger('headstop');
		});

		zig.addListener(engager);
	} else {
		alert('Zigfu cannot be load :(');
	}

	$sunLayer.on('hover', function (e) {
		$sunInformations.dialog('open');
		hideZigfuElement();
	})

	// Bird animation
	var initPosition = {
			'top': 15,
			'left': -10
		},
		position = {
			'top': initPosition.top,
			'left': initPosition.left
		},
		speed = {
			'x': 0.5,
			'y': 0
		},
		$bird = $('#bird-1')
		loopLimit = {
			'x': 600,
			'y': initPosition.top
		},
		i = 0,
		sprite = {
			'frames': [{
				'src': 'assets/images/sprites/bird-1.png',
				'x': 0,
				'y': 0,
				'width': 175,
				'height': 180
			},
			{
				'src': 'assets/images/sprites/bird-2.png',
				'x': 0,
				'y': 0,
				'width': 175,
				'height': 180
			},
			{
				'src': 'assets/images/sprites/bird-3.png',
				'x': 0,
				'y': 0,
				'width': 175,
				'height': 180
			},
			{
				'src': 'assets/images/sprites/bird-4.png',
				'x': 0,
				'y': 0,
				'width': 175,
				'height': 180
			}]
		};

	(function animateBird () {
		window.RAF(animateBird);
		position.left += speed.x;
		if (position.left >= loopLimit.x) {
			position.left = initPosition.left;
		}
		if (i === sprite.frames.length) {
			i = 0;
		}
		$bird.clearCanvas().drawImage({
				source: $(this).attr('src'),
				x: position.left,
				y: position.top,
				width: 8,
				height: 18,
				fromCenter: false
			});
		if (position.left % 15 === 0) {
			i++;
		}
	})();
});