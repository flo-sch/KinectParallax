jQuery(document).on('ready', function () {
	var posx = 0,
		posy = 0,
		posz = 0,
		engager = zig.EngageUsersWithSkeleton(1),
		$doc = jQuery(document);
		
	engager.addEventListener('userengaged', function(user) {
		console.log('User engaged: ' + user.id);
		$doc.trigger('headstart');

		user.addEventListener('userupdate', function(user) {
			posx = user.skeleton[zig.Joint.Head].position[0];
			posy = user.skeleton[zig.Joint.Head].position[1];
			posz = user.skeleton[zig.Joint.Head].position[2];
			//console.log(user.id, posx, posy, posz);
			// Update parallax layers there
			$doc.trigger('headmove', {
				'x': posx,
				'y': posy,
				'z': posz
			});
		});
	});

	engager.addEventListener('userdisengaged', function(user) {
		console.log('User disengaged: ' + user.id);
		$doc.trigger('headstop');
	});

	zig.addListener(engager);
});