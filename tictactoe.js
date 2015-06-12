
(function TicTacToe() {

	// Global variables and DOM selectors
	
	var player1= {}; 
	var player2= {};
	var currentTurn = {};
	var gameInProgress = false;
	
	var players = {
		init: function() {
			player1.el = document.getElementById('player1');
			player1.el.value = "";
			player1.name = "Player 1";
			player1.val = true;
			player1.mark = "x";

			player2.el = document.getElementById('player2');
			player2.el.value="";
			player2.name = "Player 2";
			player2.val = false;
			player2.mark = "o";

			player1.el.disabled=false;
			player2.el.disabled=false;

			// First turn defaults to player1
			currentTurn = player1;
		},
		save: function() {
			player1.input = player1.el.value;
			player2.input = player2.el.value;
			// If custom input is entered, change default
			if (player1.input !== "") {
				player1.name = player1.input;
			}
			if (player2.input !== "") {
				player2.name = player2.input;
			}
			// Disable input during game
			player1.el.disabled=true;
			player2.el.disabled=true;
		},
		nextTurn: function() {
			if (!currentTurn.val === player1.val) {
				currentTurn = player1;
				player2.el.className = "";
			}
			else {
				currentTurn = player2;
				player1.el.className = "";
			}
			currentTurn.el.className = "current";
			gameStatus.update(currentTurn.name + "'s turn");
		}
	};
	var board = {
		init: function() {		
			this.status = "none";
			this.boardCells = document.getElementsByTagName('td');
			this.cells = [null,null,null,null,null,null,null,null,null];
			console.log(this);
			for (var i = 0; i < this.boardCells.length; i++) {
				this.boardCells[i].className="blank";
				this.cells[i]=null;
			}
		},
		isSpaceEmpty: function(space) {
			if (gameInProgress) {
				if (space.className == "blank") {
					var index=space.dataset.place;
					console.log('space ' + index + " is blank, make move");
					this.makeMove(space,index);
				}
				else {
					console.warn(space);
					console.log('space is not available');
				}
			}
			else {
				console.log('Game is not in progress.');
			}
				
			
		},
		makeMove: function(space,index) {
			this.cells[index] = currentTurn.mark;
			this.boardCells[index].className = currentTurn.mark;
			console.log(this.cells);
			console.log(this.boardCells);
			space.className = currentTurn.mark;
			cellData = currentTurn.mark;
			this.check();
		},
		check: function() {
			console.log('checking...');
			//review if there are still potential winning combinations
			//review whether any winning combinations have been made
			gameStatus.isWinner();
			if (board.status == "win") {
				gameStatus.update(currentTurn.name + " wins!");
				console.log(currentTurn.name + " wins!");
				gameInProgress = false;
			}
			else if (board.status == "draw") {
				gameInProgress = false;
			}
			else {
				players.nextTurn();
			}
		}
	};
	var gameStatus = {
		init: function() {
			board.init();
			players.init();
		},
		bindEvents: function() {
			document.getElementById("resetButton").addEventListener("click", function(){
				console.log('resetButton pressed');
				gameInProgress = false;
				gameStatus.init();
				gameStatus.update("No game in progress");
			});
			document.getElementById("startButton").addEventListener("click", function(){
				console.log('startButton pressed');
				gameInProgress = true;
				board.init();
				players.save();
				gameStatus.update(player1.name + " goes first");
				
			});
			for (var i = 0; i < board.boardCells.length; ++i) {
				board.boardCells[i].addEventListener("click", function() {
					board.isSpaceEmpty(this);
				});
			}
		},
		update: function(text) {
			document.querySelector('h3').innerText = text;
		},
		isWinner: function() {
			var wins = [
			  [0,1,2],
			  [3,4,5],
			  [6,7,8],
			  [0,3,6],
			  [1,4,7],
			  [2,5,8],
			  [0,4,8],
			  [2,4,6]
			 ];
			for(var i=0; i<wins.length; i++) {
				var a, b, c;
				// either holding 'x', 'o', or null
				a = board.cells[wins[i][0]];
				b = board.cells[wins[i][1]];
				c = board.cells[wins[i][2]];
				if (a == b && a == c && a != null) {
					board.status = "win";
					console.log(a,b,c);
				}
			}
		},
		isDraw: function() {

		}
	};

	// Wait until DOM is loaded to init gameStatus
	document.addEventListener("DOMContentLoaded", function() {
		console.log('Document loaded');
		gameStatus.init();
		gameStatus.update("No game in progress");
		gameStatus.bindEvents();
	});
	
	

})();
