/**
 * Loader file for Seidelin game
 */

var jewel = {
		screens : {},
		settings : {
			rows : 8,
			cols : 8,
			baseScore : 100,
			numJewelTypes : 7,
			controls : {
				KEY_UP :     'moveUp',
				KEY_LEFT :   'moveLeft',
				KEY_DOWN :   'moveDown',
				KEY_RIGHT :  'moveRight',
				KEY_ENTER :  'selectJewel',
				KEY_SPACE :  'selectJewel',
				CLICK :      'selectJewel',
				TOUCH :      'selectJewel'
			},
			baseLevelTimer : 60000,
			baseLevelScore : 1500,
			baseLevelExp :   1.05
		},
		images : {}
};

// wait until document is loaded
window.addEventListener('load', function() {
	
	// determine jewel size
	var jewelProto = document.getElementById('jewel-proto'),
	    rect = jewelProto.getBoundingClientRect();
	
	jewel.settings.jewelSize = rect.width;
	
	// console.log('Run iOS standalone test ...');
	var ios_test = 'Result: ' + (window.navigator.standalone != false);
	// console.log(ios_test);

	Modernizr.addTest('standalone', function() {
		return (window.navigator.standalone != false);
	});

	Modernizr.addTest('webgl2', function() {
		try {
			var canvas = document.createElement('canvas'),
			    ctx = canvas.getContext('experimental-webgl');
			return !!ctx;
		} catch(e) {
			return false;
		};
	});
	
    // extend yepnope
	yepnope.addPrefix('preload', function(resource) {
		resource.noexec = true;
		return resource;
	});
	
	var numPreload = 0,
	    numLoaded =  0;
	    
	yepnope.addPrefix('loader', function(resource) {
		// console.log('Loading: ' + resource.url);
		var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
		resource.noexec = isImage;
		
		numPreload++;
		resource.autoCallback = function(e) {
			// console.log('Finished loading: ' + resource.url);
			numLoaded++;
			if (isImage) {
				var image = new Image();
				image.src = resource.url;
				jewel.images[resource.url] = image;
			}
		};
		return resource;
	});
	
	function getLoadProgress() {
		if (numPreload > 0) {
			return (numLoaded / numPreload);
		} else {
			return 0;
		}
	}
	
	// console.log('Begin loading files stage 1 ...');
	
	// begin dynamic loading stage 1
	Modernizr.load([
	    {
	    	test : Modernizr.localstorage,
	    	yep : 'scripts/storage.js',
	    	nope : 'scripts/storage.cookie.js'
	    },{
	    	// always load these files    	
	    	load : [
	    	    'scripts/sizzle.js',
	    	    'scripts/dom.js',
	    	    'scripts/requestAnimationFrame.js',
	    	    'scripts/game.js',
	    	    'scripts/screen.splash.js'
	    	]
	    },{
	    	complete : function() {
	    		jewel.game.setup();
	    		jewel.game.showScreen('splash-screen', getLoadProgress);
	    	}
	    }   
	]);
		
	// loading stage 2
	// console.log('Loading files stage 2 ...');
	
	Modernizr.load([{
			test : Modernizr.webgl2,
			yep : [
			    'loader!scripts/webgl.js',
			    'loader!scripts/webgl-debug.js',
			    'loader!scripts/glMatrix-0.9.5.min.js',
			    'loader!scripts/display.webgl.js',
			    'loader!images/jewelpattern.jpg',
			]
		},{
	    	test :   Modernizr.canvas && !Modernizr.webgl2,
	    	yep :    'loader!scripts/display.canvas.js'
	    },{
	    	test : !Modernizr.canvas,
	    	yep :  'loader!scripts/display.dom.js'
	    },{
	    	test :   Modernizr.webworkers,
	    	yep :   [
	    	    'loader!scripts/board.worker-interface.js',
	    	    'preload!scripts/board.worker.js'
	    	],
	    	nope :  'loader!scripts/board.js'
	    },{
	        load : [
	            'loader!scripts/audio.js',
	            'loader!scripts/input.js',
	            'loader!scripts/screen.hiscore.js',
	            'loader!scripts/screen.main-menu.js',
	            'loader!scripts/screen.game.js',
	            'loader!images/jewels' + jewel.settings.jewelSize + '.png'
	        ]
	    }
	]);
	// console.log('All files loaded!');
	
	
	
}, false);
