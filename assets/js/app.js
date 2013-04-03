jQuery(document).on('ready', function () {
	if (zig) {
		var posx = 0,
			posy = 0,
			posz = 0,
			engager = zig.EngageUsersWithSkeleton(1),
			$doc = jQuery(document),
			$kinectX = jQuery('#kinect-x'),
			$kinectY = jQuery('#kinect-y'),
			$kinectZ = jQuery('#kinect-z');
			
		engager.addEventListener('userengaged', function(user) {
			$doc.trigger('headstart');

			user.addEventListener('userupdate', function(user) {
				posx = user.skeleton[zig.Joint.Head].position[0];
				posy = user.skeleton[zig.Joint.Head].position[1];
				posz = user.skeleton[zig.Joint.Head].position[2];
				//console.log(user.id, posx, posy, posz);
				// Update parallax layers there
				$kinectX.text(posx);
				$kinectY.text(posy);
				$kinectZ.text(posz);
				$doc.trigger('headmove', {
					'x': posx,
					'y': posy,
					'z': posz
				});
			});
		});

		engager.addEventListener('userdisengaged', function(user) {
			$doc.trigger('headstop');
		});

		zig.addListener(engager);
	} else {
		alert('Zigfu cannot be load :(');
	}
});