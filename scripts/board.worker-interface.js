/**
 * Interface between board.js and board.worker.js 
 */

jewel.board = (function() {
	var dom = jewel.dom,
	          settings,
	          worker,
	          messageCount,
	          callbacks;
	
	function messageHandler(event) {
		var message = event.data;
		jewels = message.jewels;
		
		if (callbacks[message.id]) {
			callbacks[message.id](message.data);
			delete callbacks[message.id];
		}
	}
	
	function initialize(startJewels, callback) {
		// console.log('Board.worker-interface.js initialize();');
		settings =  jewel.settings;
		rows =      settings.rows;
		cols =      settings.cols;
	    
		// console.log('Pre worker declaration.');
		messageCount = 0;
		callbacks =    [];
		worker =       new Worker('scripts/board.worker.js');
		// console.log('Post worker declaration.');
		
		dom.bind(worker, 'message', messageHandler);
		var data = {
			settings : settings,
			startJewels : startJewels
		}
		post('initialize', data, callback);
	}
	
	function post(command, data, callback) {
		callbacks[messageCount] = callback;
		worker.postMessage({
			id : messageCount,
			command : command,
			data : data
		});
		messageCount++;
	}
	
	function swap(x1, y1, x2, y2, callback) {
		post('swap', {
			x1 : x1,
			y1 : y1,
			x2 : x2,
			y2 : y2
		}, callback);
	}
	
	function getJewel(x, y) {
		if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1) {
			return -1;
		} else {
			return jewels[x][y];
		}
	}
	
	function print() {
		var str = '';
		for (var y = 0; y < rows; y++) {
			for (var x = 0; x < cols; x++) {
				str += getJewel(x, y) + ' ';
			}
			str += '\r\n';
		}
		// console.log(str);
	}
	
	function getBoard() {
		// create a copy of board
		var copy = [],
		    x;
		
		for (x = 0; x < cols; x++) {
			copy[x] = jewels[x].slice(0);
		}
		
		return copy;
	}
	
	return {
		initialize : initialize,
		swap :       swap,
		getBoard :   getBoard,
		getJewel :   getJewel,
		print :      print
	};
	
})();