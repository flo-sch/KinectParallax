jQuery(document).on('ready', function () {
	if (zig) {
		var posx = 0,
			posy = 0,
			posz = 0,
			engager = zig.EngageUsersWithSkeleton(1),
			$doc = jQuery(document),
			$kinectX = jQuery('#kinect-x'),
			$kinectY = jQuery('#kinect-y'),
			$kinectZ = jQuery('#kinect-z'),
			$viewport = jQuery('#kinect-parallax'),
			handSession = {
				'$el': jQuery('#cursor'),
				'cursor': zig.controls.Cursor()
			},
			cursorAreaWidth = $viewport.width() - handSession.$el.width(),
			cursorAreaHeight = $viewport.height() - handSession.$el.height(),
			handEvents = {
				onsessionstart: function (e) {
					console.log('start', e, this);
					handSession.$el.show();
					handSession.cursor.addEventListener('move', function (cursor) {
						handSession.$el.css({
							'left': cursor.x * cursorAreaWidth,
							'top': cursor.y * cursorAreaHeight
						});
					});
				},
				onsessionupdate: function (e) {
					//console.log('update', e);
				},
				onsessionend: function (e) {
					console.log('end', e);
					handSession.$el.hide();
				},
				onattach: function (user) {
					console.log('attach', user);
				},
				ondetach: function (user) {
					console.log('detach', user);
				}
			},
			pushEvents = {
				onpush: function (pushEvent) {
					console.log('push', pushEvent.pushPosition);
				},
				onrelease: function (releaseEvent) {
					console.log('release', releaseEvent.pushPosition);
				},
				onclick: function (clickEvent) {
					console.log('click', clickEvent.pushPosition);
				}
			},
			handSessionDetector,
			pushDetector,
			onUserMove = function(user) {
				posx = user.skeleton[zig.Joint.Head].position[0];
				posy = user.skeleton[zig.Joint.Head].position[1];
				posz = user.skeleton[zig.Joint.Head].position[2];
				$kinectX.text(posx);
				$kinectY.text(posy);
				$kinectZ.text(posz);
				$doc.trigger('headmove', {
					'x': posx,
					'y': posy,
					'z': posz
				});
			};
			
		engager.addEventListener('userengaged', function(user) {
			user.addEventListener('userupdate', onUserMove);

			handSessionDetector = zig.HandSessionDetector();
			handSessionDetector.addListener(handEvents);
			user.addListener(handSessionDetector);

			pushDetector = zig.controls.PushDetector();
			pushDetector.addEventListener('push', pushEvents.onpush);
			pushDetector.addEventListener('release', pushEvents.onrelease);
			pushDetector.addEventListener('click', pushEvents.onclick);
			zig.singleUserSession.addListener(pushDetector);

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
		zig.singleUserSession.addListener(handSession.cursor);
	} else {
		alert('Zigfu cannot be load :(');
	}

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