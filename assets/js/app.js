jQuery(document).on('ready', function () {
	if (zig) {
		var Application = function (config) {
				this.version = '1.0.0';
				this.defaults = {
					'debug': true,
					'viewport': $('#kinect-parallax'),
					'body': $('body'),
					'enable': {
						'parallax': true,
						'hand': true
					},
					onUserMove: function(user) {
						if (this.config.enable.parallax === true) {
							this.position.x = user.skeleton[zig.Joint.Head].position[0];
							this.position.y = user.skeleton[zig.Joint.Head].position[1];
							this.position.z = user.skeleton[zig.Joint.Head].position[2];
							this.$headX.text(this.position.x);
							this.$headY.text(this.position.y);
							this.$headZ.text(this.position.z);
							this.$doc.trigger('headmove', {
								'x': this.position.x,
								'y': this.position.y,
								'z': this.position.z
							});
						}
					},
					carAnimationSpeed: 250
				};
				this.config = $.extend({}, this.defaults, config);
				this.init();
			},
			App;
		Application.prototype = {
			init: function () {
				var app = this;
				this.$doc = $(document);
				this.$win = $(window);
				this.$debug = $('#debug');
				this.$headX = $('#head-x');
				this.$headY = $('#head-y');
				this.$headZ = $('#head-z');
				this.$viewport = this.config.viewport;
				this.$body = this.config.body;
				this.$user = $('#app-user');
				this.$car = $('#car');
				this.cars = [
					'assets/images/layers/layer-2bis.png',
					'assets/images/layers/layer-2bis-c1.png',
					'assets/images/layers/layer-2bis-c2.png',
					'assets/images/layers/layer-2bis-c3.png',
					'assets/images/layers/layer-2bis-c4.png',
					'assets/images/layers/layer-2bis-c5.png',
					'assets/images/layers/layer-2bis-c6.png',
					'assets/images/layers/layer-2bis-c7.png'
				];
				this.currentCar = 0;
				this.lockSwipe = false;
				this.handSession = {
					'$el': $('#cursor'),
					'cursor': zig.controls.Cursor()
				}
				this.cursorAreaWidth = this.$viewport.width() - this.handSession.$el.width();
				this.cursorAreaHeight = this.$viewport.height() - this.handSession.$el.height();
				this.HoverTimer = (function () {
					function Timer(delay, callback) {
						this.timeout = null;
						this.delay = delay * 1000;
						this.callback = callback;
						this.callbackArgs = Array.prototype.slice.call(arguments, 2);
					};
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
				})();
				this.detectors = {
					'handSession': null,
					'push': null,
					'swipe': null,
					'wave': null
				};
				this.events = {
					'hand': {
						onattach: function (user) {

						},
						onsessionstart: function (e) {
							if (app.config.enable.hand === true) {
								app.handSession.$el.show();
								app.handSession.cursor.addEventListener('move', function (cursor) {
									app.handSession.$el.css({
										'left': cursor.x * app.cursorAreaWidth,
										'top': cursor.y * app.cursorAreaHeight
									});
								});
							}
						},
						onsessionend: function (e) {
							app.handSession.$el.hide();
						},
						ondetach: function (user) {

						}
					},
					'push': {
						onpush: function (pushEvent) {
							if (app.config.enable.hand === true) {
								app.handSession.$el.addClass('active');
							}
						},
						onrelease: function (releaseEvent) {
							// Trigger something
							app.$doc.trigger('push', {
								'position': releaseEvent.pushPosition
							});
							app.handSession.$el.removeClass('active');
						},
						onclick: function (clickEvent) {

						}
					},
					'swipe': {
						swipe: function (swipeEvent) {

						},
						swipeup: function (swipeEvent) {
							if (app.config.enable.hand === true) {
								//app.$sunInformations.dialog('close');
							}
						},
						swipedown: function (swipeEvent) {
							if (app.config.enable.hand === true) {
								//app.$sunInformations.dialog('close');
							}
						},
						swipeleft: function (swipeEvent) {
							if (app.config.enable.hand === true) {
								//app.$sunInformations.dialog('close');
								if (app.lockSwipe === false) {
									app.lockSwipe = true;
									setTimeout(function () {
										app.unlockSwipe();
									}, app.config.carAnimationSpeed * 4);
									app.currentCar--;
									if (app.currentCar < 0) {
										app.currentCar = app.cars.length - 1;
									}
									var $oldCar = app.$car,
										$parentLayer = $oldCar.parent(),
										currentLeft = parseInt($oldCar.attr('data-offset-left')),
										moveOldCarTo = currentLeft - (($parentLayer.width() - app.$viewport.width()) / 2) - $oldCar.width(),
										$newCar = $('<img/>', {
											'id': 'car',
											'data-offset-left': currentLeft,
											'src': app.cars[app.currentCar]
										}).on('load', function () {
											if (Modernizr.csstransitions && Modernizr.csstransforms3d) {
												$newCar.css({
													'position': 'absolute',
													'-webkit-transform': 'translate(' + (app.$viewport.width() + $oldCar.width() + parseInt($oldCar.attr('data-offset-left'))) + 'px, 0px) translateZ(0)',
													'-moz-transform': 'translate(' + (app.$viewport.width() + $oldCar.width() + parseInt($oldCar.attr('data-offset-left'))) + 'px, 0px) translateZ(0)',
													'-ms-transform': 'translate(' + (app.$viewport.width() + $oldCar.width() + parseInt($oldCar.attr('data-offset-left'))) + 'px, 0px) translateZ(0)',
													'-o-transform': 'translate(' + (app.$viewport.width() + $oldCar.width() + parseInt($oldCar.attr('data-offset-left'))) + 'px, 0px) translateZ(0)',
													'transform': 'translate(' + (app.$viewport.width() + $oldCar.width() + parseInt($oldCar.attr('data-offset-left'))) + 'px, 0px) translateZ(0)'
												});
												$oldCar.transition({
													x: moveOldCarTo,
													y: 0
												}, app.config.carAnimationSpeed, 'ease', function () {
													$oldCar.remove();
													$newCar.appendTo($parentLayer).transition({
														x: currentLeft,
														y: 0
													}, app.config.carAnimationSpeed, 'ease', function () {
														app.$car = $newCar;
													});
												});
											} else {
												$newCar.css({
													'position': 'absolute',
													'left': app.$viewport.width() + $oldCar.width() + parseInt($oldCar.attr('data-offset-left'))
												});
												$oldCar.animate({
													'left': moveOldCarTo
												}, app.config.carAnimationSpeed, 'swing', function () {
													$oldCar.remove();
													$newCar.appendTo($parentLayer).animate({
														'left': currentLeft
													}, app.config.carAnimationSpeed, 'swing', function () {
														app.$car = $newCar;
													});
												});

											}
										});
								}
							}
						},
						swiperight: function (swipeEvent) {
							if (app.config.enable.hand === true) {
								//app.$sunInformations.dialog('close');
								if (app.lockSwipe === false) {
									app.lockSwipe = true;
									setTimeout(function () {
										app.unlockSwipe();
									}, app.config.carAnimationSpeed * 4);
									app.currentCar++;
									if (app.currentCar >= app.cars.length) {
										app.currentCar = 0;
									}
									var $oldCar = app.$car,
										$parentLayer = $oldCar.parent(),
										currentLeft = parseInt($oldCar.attr('data-offset-left')),
										moveOldCarTo = app.$viewport.width() + $oldCar.width() + currentLeft,
										$newCar = $('<img/>', {
											'id': 'car',
											'data-offset-left': currentLeft,
											'src': app.cars[app.currentCar]
										}).on('load', function () {
											if (Modernizr.csstransitions && Modernizr.csstransforms3d) {
												$newCar.css({
													'position': 'absolute',
													'left': 'auto',
													'-webkit-transform': 'translate(' + (parseInt($oldCar.attr('data-offset-left')) - (($parentLayer.width() - app.$viewport.width()) / 2) - $oldCar.width()) + 'px, 0px) translateZ(0)',
													'-moz-transform': 'translate(' + (parseInt($oldCar.attr('data-offset-left')) - (($parentLayer.width() - app.$viewport.width()) / 2) - $oldCar.width()) + 'px, 0px) translateZ(0)',
													'-ms-transform': 'translate(' + (parseInt($oldCar.attr('data-offset-left')) - (($parentLayer.width() - app.$viewport.width()) / 2) - $oldCar.width()) + 'px, 0px) translateZ(0)',
													'-o-transform': 'translate(' + (parseInt($oldCar.attr('data-offset-left')) - (($parentLayer.width() - app.$viewport.width()) / 2) - $oldCar.width()) + 'px, 0px) translateZ(0)',
													'transform': 'translate(' + (parseInt($oldCar.attr('data-offset-left')) - (($parentLayer.width() - app.$viewport.width()) / 2) - $oldCar.width()) + 'px, 0px) translateZ(0)'
												});
												$oldCar.transition({
													x: moveOldCarTo,
													y: 0
												}, app.config.carAnimationSpeed, 'ease', function () {
													$oldCar.remove();
													$newCar.appendTo($parentLayer).transition({
														x: currentLeft,
														y: 0
													}, app.config.carAnimationSpeed, 'ease', function () {
														app.$car = $newCar;
													});
												});
											} else {
												$newCar.css({
													'position': 'absolute',
													'left': parseInt($oldCar.attr('data-offset-left')) - (($parentLayer.width() - app.$viewport.width()) / 2) - $oldCar.width()
												});
												$oldCar.animate({
													'left': moveOldCarTo
												}, app.config.carAnimationSpeed, 'swing', function () {
													$oldCar.remove();
													$newCar.appendTo($parentLayer).animate({
														'left': currentLeft
													}, app.config.carAnimationSpeed, 'swing', function () {
														app.$car = $newCar;
													});
												});
											}
										});
								}
							}
						},
						swiperelease: function (swipeEvent) {

						}
					},
					'wave': {
						wave: function (waveEvent) {
							if (app.config.enable.hand === true) {
								/*
								app.currentCar = Math.floor(Math.random() * app.cars.length);
								var $newCar = $('<img/>', {
									'src': app.cars[app.currentCar]
								}).on('load', function () {
									app.$car.attr('src', $newCar.attr('src'));
								});
*/
							}
						}
					}
				};
				// Bind keyboards to enable/disable Parallax/Hand Gestures
				this.$win.on('keyup', function (keyboardEvent) {
					switch (true) {
						case ((keyboardEvent.keyCode === 72) && (keyboardEvent.altKey === true)):
							// H
							app.toggleHandGestures();
							break;
						case ((keyboardEvent.keyCode === 80) && (keyboardEvent.altKey === true)):
							// H
							app.toggleParallax();
							break;
						default:
							break;
					}
				});
				// Preload sounds of Buzz
				this.sounds = {
					'plop': new buzz.sound('assets/audio/plop', {
						formats: ['ogg']
					})
				};
				this.position = {
					'x': 0,
					'y': 0,
					'z': 0
				};
				// Debug table
				if (this.config.debug === false) {
					this.$debug.remove();
				}
				this.initZigfu();
			},
			initZigfu: function () {
				var app = this;
				this.engager = zig.EngageUsersWithSkeleton(1);
				this.engager.addEventListener('userengaged', function(user) {
					app.$user.append(
						$('<p/>').text('Hey you! Try to move your head in order to watch the layers move!')
					).append(
						$('<p/>').text('Then put up your hand in front of the camera, and swipe / wave to change the color of the volvo car!')
					);

					app.detectors.handSession = zig.HandSessionDetector();
					app.detectors.handSession.addListener(app.events.hand);
					app.detectors.handSession.addListener(app.handSession.cursor);

					app.detectors.push = zig.controls.PushDetector();
					app.detectors.push.addEventListener('push', app.events.push.onpush);
					app.detectors.push.addEventListener('release', app.events.push.onrelease);
					app.detectors.push.addEventListener('click', app.events.push.onclick);
					app.detectors.handSession.addListener(app.detectors.push);

					app.detectors.wave = zig.controls.WaveDetector();
					app.detectors.wave.addEventListener('wave', app.events.wave.wave);
					app.detectors.handSession.addListener(app.detectors.wave);

					app.detectors.swipe = zig.controls.SwipeDetector();
					app.detectors.swipe.addEventListener('swipe', app.events.swipe.swipe);
					app.detectors.swipe.addEventListener('swipeup', app.events.swipe.swipeup);
					app.detectors.swipe.addEventListener('swipedown', app.events.swipe.swipedown);
					app.detectors.swipe.addEventListener('swipeleft', app.events.swipe.swipeleft);
					app.detectors.swipe.addEventListener('swiperight', app.events.swipe.swiperight);
					app.detectors.swipe.addEventListener('swiperelease', app.events.swipe.swiperelease);
					app.detectors.handSession.addListener(app.detectors.swipe);

					user.addListener(app.detectors.handSession);

					app.position.x = user.skeleton[zig.Joint.Head].position[0];
					app.position.y = user.skeleton[zig.Joint.Head].position[1];
					app.position.z = user.skeleton[zig.Joint.Head].position[2];
					app.$doc.trigger('headstart', {
						'x': app.position.x,
						'y': app.position.y,
						'z': app.position.z
					});

					user.addEventListener('userupdate', function (user) {
						app.config.onUserMove.call(app, user);
					});
				});
				this.hideZigfuLink();

				this.engager.addEventListener('userdisengaged', function(user) {
					app.detectors.push.removeEventListener('push', app.events.push.onpush);
					app.detectors.push.removeEventListener('release', app.events.push.onrelease);
					app.detectors.push.removeEventListener('click', app.events.push.onclick);
					app.detectors.handSession.removeListener(app.detectors.push);
					app.detectors.push = null;

					app.detectors.wave.removeEventListener('wave', app.events.wave.wave);
					app.detectors.handSession.removeListener(app.detectors.wave);
					app.detectors.wave = null;

					app.detectors.swipe = zig.controls.SwipeDetector();
					app.detectors.swipe.removeEventListener('swipe', app.events.swipe.swipe);
					app.detectors.swipe.removeEventListener('swipeup', app.events.swipe.swipeup);
					app.detectors.swipe.removeEventListener('swipedown', app.events.swipe.swipedown);
					app.detectors.swipe.removeEventListener('swipeleft', app.events.swipe.swipeleft);
					app.detectors.swipe.removeEventListener('swiperight', app.events.swipe.swiperight);
					app.detectors.swipe.removeEventListener('swiperelease', app.events.swipe.swiperelease);
					app.detectors.swipe = null;

					app.detectors.handSession.removeListener(app.events.hand);
					app.detectors.handSession.removeListener(app.handSession.cursor);

					user.removeEventListener('userupdate', function (user) {
						app.config.onUserMove.call(app, user);
					});
					app.$user.empty();
					app.$doc.trigger('headstop');
				});

				zig.addListener(this.engager);
			},
			toggleParallax: function () {
				this.config.enable.parallax = !this.config.enable.parallax;
			},
			toggleHandGestures: function () {
				this.config.enable.hand = !this.config.enable.hand;
			},
			unlockSwipe: function () {
				this.lockSwipe = false;
			},
			displayLoader: function () {
				$('body').append($('<div/>', {
					'class': 'overlay'
				})).spin({
					lines: 12, // The number of lines to draw
					length: 10, // The length of each line
					width: 1, // The line thickness
					radius: 10, // The radius of the inner circle
					corners: 0, // Corner roundness (0..1)
					rotate: 0, // The rotation offset
					direction: 1, // 1: clockwise, -1: counterclockwise
					color: '#FFFFFF', // #rgb or #rrggbb
					speed: 1, // Rounds per second
					trail: 80, // Afterglow percentage
					shadow: false, // Whether to render a shadow
					hwaccel: false, // Whether to use hardware acceleration
					className: 'spinner', // The CSS class to assign to the spinner
					zIndex: 2e9, // The z-index (defaults to 2000000000)
					top: 'auto', // Top position relative to parent in px
					left: 'auto' // Left position relative to parent in px
				});
			},
			hideLoader: function () {
				$('body').spin(false)
				$('.overlay').remove();
			},
			hideZigfuLink: function () {
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
			},
			play: function (sound) {
				if (sound in this.sounds) {
					this.sounds[sound].play();
				}
			}
		};
		App = new Application({
			debug: false,
			body: $('body'),
			viewport: $('#kinect-parallax'),
			enable: {
				parallax: true,
				hand: true
			}
		});

		// Bird animation
		/*
		var initPosition = {
				'top': 0,
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
				}, {
					'src': 'assets/images/sprites/bird-2.png',
					'x': 0,
					'y': 0,
					'width': 175,
					'height': 180
				}, {
					'src': 'assets/images/sprites/bird-3.png',
					'x': 0,
					'y': 0,
					'width': 175,
					'height': 180
				}, {
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
		*/
	} else {
		alert('Zigfu cannot be load :(');
	}
});