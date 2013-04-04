jQuery(document).on('ready', function () {
	if (zig) {
		var users = [],
			maxUsersAllowed = 1,
			posx = 0,
			posy = 0,
			posz = 0,
			engager = zig.EngageUsersWithSkeleton(1),
			$doc = jQuery(document),
			$kinectX = jQuery('#kinect-x'),
			$kinectY = jQuery('#kinect-y'),
			$kinectZ = jQuery('#kinect-z');
			
		engager.addEventListener('userengaged', function(user) {
			if (users.length < maxUsersAllowed) {
				users.push(user);
				posx = user.skeleton[zig.Joint.Head].position[0];
				posy = user.skeleton[zig.Joint.Head].position[1];
				posz = user.skeleton[zig.Joint.Head].position[2];
				$doc.trigger('headstart', {
					'x': posx,
					'y': posy,
					'z': posz
				});

				user.addEventListener('userupdate', function(user) {
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
				});
			}
		});

		engager.addEventListener('userdisengaged', function(user) {
			var userIndex = $.inArray(user, users);
			if (userIndex > -1) {
				users.splice(userIndex, 1);
				$doc.trigger('headstop');
			}
		});

		zig.addListener(engager);
	} else {
		alert('Zigfu cannot be load :(');
	}
});