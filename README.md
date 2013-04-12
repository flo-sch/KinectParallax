KinectParallax - Kinect-based Parallax jQuery plugin
===
---


#### This plugin uses the [Kinect for Windows technology][1], you need one xBox Kinect camera, and to install the drivers.

Then you're ready to start a new project using Kinect for Windows.

This project is any HTML5 application using JavaScript libraries.

##### This plugin is based on [Stephband jParallax][8] great stuff, thanks a lot to him !
---

##### Dependencies:
1. [Modernizr, especially the CSS3 features detection][2]
2. [jQuery, that you allready know][3]
3. [Zigfu, a JS ZDK for Kinect for Windows][4]
4. Some transparent images to display as parallax layers

##### This projects uses, without requirements, the following libraries:
1. [Transit, a CSS3 animations JavaScript library][5]

===

Once you've started your HTML5 application, by instance with the [HTML5 BoilerPlate snippet][6],
define your viewport and layers elements in your HTML template, then just include the [Kinect-Parallax jQuery plugin][7] that you can find in the assets/js/vendors folder of this project.

###### Just pay attention to the integration !
Your layers need to be horizontaly and verticaly centered, or your parallax effect will not make sense.
They need to have a pixels-fixed width and height too.
Then you can position the image of these layers as you want, by instance in any absolute position !
    
    <!DOCTYPE html>
        <head>
            <meta charset='utf-8'>
            <title>Kinect-Parallax</title>
            <link rel='stylesheet' media='screen' href='assets/css/jquery.kinect-parallax.min.css' />
            <script src='assets/js/vendor/modernizr-2.6.2.min.js'></script>
        </head>
        <body>
            <section id='kinect-parallax' class='kinect-parallax-viewport'>
                <!-- .kinect-parallax-laery are our layers, just set them a width, a height, and a z-index ! -->
                <div id='kinect-parallax-layer-1' class='kinect-parallax-layer'>
                    <img src='assets/images/layers/layer-1bis.png' alt='Front'>
                </div>
                <div id='kinect-parallax-layer-2' class='kinect-parallax-layer'>
                    <img src='assets/images/layers/layer-3bis.png' alt='Left moutains'>
                </div>
                <div id='kinect-parallax-layer-3' class='kinect-parallax-layer'>
                    <img src='assets/images/layers/layer-4bis.png' alt='Right moutains'>
                </div>
                <div id='kinect-parallax-layer-4' class='kinect-parallax-layer'>
                    <img src='assets/images/layers/layer-5bis.png' alt='Background moutains'>
                </div>
                <div id='kinect-parallax-layer-5' class='kinect-parallax-layer'>
                    <img src='assets/images/layers/layer-6bis.png' alt='Sky and sun'>
                </div>
            </section>
            <script src='http://code.jquery.com/jquery-latest.min.js'></script>
      	    <script>window.jQuery || document.write('<script src=\'assets/js/vendor/jquery-1.9.1.min.js\'><\/script>')</script>
            <script src='assets/js/vendor/jquery.kinect-parallax.js'></script>
      	    <script src='assets/js/vendor/zigfu.min.js'></script>
            <script>
                $(document).on('ready', function() {
                    var $viewport = $('#kinect-parallax'),
                    $layers = $('#kinect-parallax .kinect-parallax-layer').KinectParallax('init', {
                            'viewport': $viewport, // viewport element, body by default
                            'axisXAllowed': true, // allow layers to move on X-axis
                            'axisYAllowed': true, // allow layers to move on Y-axis
                            'axisZAllowed': true, // allow layers be scaled depending of the Z-axis
                            'scaling': {
                                'min': 0.80, // min value for scale() CSS3 transform, if allowed
                                'max': 1.20 // max value for scale() CSS3 transform, if allowed
                            },
                            'axisZ': 100 // Base of your depth, it means that a layer with a z-index to 100 is the closest possible.
                        }),
                        initialPosition = {
                            'x': null,
                            'y': null,
                            'z': null
                        },
                        engager = zig.EngageUsersWithSkeleton(1);
                    
                    // Bind kinect events and trigger KinectParallax to update the layers
                    engager.addEventListener('userengaged', function(user) {
                        
                        // Engage the first user with start method.
                        $layers.KinectParallax('start', {
                            x: user.skeleton[zig.Joint.Head].position[0],
                            y: user.skeleton[zig.Joint.Head].position[1],
                            z: user.skeleton[zig.Joint.Head].position[2]
                        });
                        
                        // Focus on this user until he's lost.
                        user.addEventListener('userupdate', function (user) {
                            
                            // Call the update method with the coordinates to move the layers
                            $layers.KinectParallax('move', {
                                x: user.skeleton[zig.Joint.Head].position[0],
                                y: user.skeleton[zig.Joint.Head].position[1],
                                z: user.skeleton[zig.Joint.Head].position[2]
                            });
                        });
                    });
                    
                    // Stop the layers when the engaged user is lost.
                    engager.addEventListener('userdisengaged', function (user) {
                        $layers.KinectParallax('stop');
                    });
                });
            </script>
        </body>
    </html>


[1]: http://www.microsoft.com/en-us/kinectforwindows/
[2]: http://modernizr.com/
[3]: http://jquery.com/
[4]: http://zigfu.com/en/zdk/javascript/
[5]: http://ricostacruz.com/jquery.transit/
[6]: http://html5boilerplate.com/
[7]: assets/js/vendor/jquery.kinect-parallax.js
[8]: https://github.com/stephband/jparallax
