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
			console.log('user engaged', user.id);
			user.addEventListener('userupdate', onUserMove);

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
			console.log('user disengaged', user.id);
			console.log('removeEventListener', user.id);
			user.removeEventListener('userupdate', onUserMove);
			$doc.trigger('headstop');
		});

		zig.addListener(engager);
	} else {
		alert('Zigfu cannot be load :(');
	}

	var x =  -10;
    var y = 75;
    var speed = 2;
    var i = j = l= 1;


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
			'x': 1,
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
			source: sprite.frames[i].src,
			x: position.left,
			y: position.top,
			width: 8,
			height: 18,
			fromCenter: false
		});
		if (position.left % 20 === 0) {
			i++;
		}
	})();
});