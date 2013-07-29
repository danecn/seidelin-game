/**
 * Displays game board using canvas element
 */

jewel.display = (function() {
	var cursor,
	    jewels,
	    dom = jewel.dom,
	    $ = dom.$,
	    canvas,
	    ctx,
	    cols,
	    rows,
	    jewelSize,
	    firstRun = true;
	
	function createBackground() {
        console.log('Display.canvas.js createBackground();');
		var background = document.createElement('canvas'),
		    bgctx = background.getContext('2d');
		
		dom.addClass(background, 'background');
		background.width = cols * jewelSize;
		background.height = rows * jewelSize;
		
		bgctx.fillStyle = 'rgba(225,235,255,0.15)';
		for (var x = 0; x < cols; x++) {
			for (var y = 0; y < cols; y++) {
				if( (x + y) % 2 ) {
					bgctx.fillRect(
						x * jewelSize, y* jewelSize,
						jewelSize, jewelSize
					);
				}
			}
		}
		return background;
	}
	
	function setup() {
		console.log('Display.canvas.js setup();');
		
		var boardElement = $('#game-screen .game-board')[0];
		
		cols = jewel.settings.cols;
		rows = jewel.settings.rows;
		jewelSize = jewel.settings.jewelSize;
	
		canvas = document.createElement('canvas');
		ctx = canvas.getContext('2d');
		dom.addClass(canvas, 'board');
		canvas.width = cols * jewelSize;
		canvas.height = rows * jewelSize;
		
		boardElement.appendChild(createBackground());
		boardElement.appendChild(canvas);
	}
		
	function initialize(callback) {
		console.log('Display.canvas.js initialize();');
		if (firstRun) {
			setup();
			firstRun = false;
		}
		callback();
	}
	
	function drawJewel(type, x, y) {
		var image = jewel.images['images/jewels' + jewelSize + '.png'];
		ctx.drawImage(image, type * jewelSize, 0, jewelSize, jewelSize,
			x * jewelSize, y * jewelSize, jewelSize, jewelSize
		);  
	}

	function redraw(newJewels, callback) {
		var x, y;
		jewels = newJewels;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for (x = 0; x < cols; x++) {
			for (y = 0; y < rows; y++) {
				drawJewel(jewels[x][y], x, y);
			}
		}
		callback();
		renderCursor();
	}
	
	function renderCursor() {
		if (!cursor) {
			return;
		}
		var x = cursor.x,
		    y = cursor.y;
		
		clearCursor();
		
		if (cursor.selected) {
			ctx.save();
			ctx.globalCompositeOperation = 'lighter';
			ctx.globalAlpha = 0.8;
			drawJewel(jewels[x][y], x, y);
			ctx.restore();
		}
		ctx.save();
		ctx.lineWidth = 0.05 * jewelSize;
		ctx.strokeStyle = 'rgba(250, 250, 150, 0.8)';
		ctx.strokeRect(
			(x + 0.05) * jewelSize, (y + 0.05) * jewelSize,
			0.9 * jewelSize, 0.9 * jewelSize
		);
		ctx.restore();
	}
	
	function clearJewel(x, y) {
		ctx.clearRect(x * jewelSize, y * jewelSize, jewelSize, jewelSize);
	}
	
	function clearCursor () {
		if (cursor) {
			var x = cursor.x,
			    y = cursor.y;
			clearJewel(x, y);
			drawJewel(jewels[x][y], x, y);
		}
	}
	
	function setCursor(x, y, selected) {
		clearCursor();
		if (arguments.length > 0) {
			cursor = {
			    x : x,
			    y : y,
			    selected : selected
			};
		} else {
			cursor = null;
		}
		renderCursor();
	}	
	
	return {
		initialize : initialize,
		redraw : redraw,
		setCursor : setCursor
	}
	
})();