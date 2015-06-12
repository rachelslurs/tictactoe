
(function TicTacToe() {

	// Global variables and DOM selectors
	
	var player1= {}; 
	var player2= {};
	var currentTurn = {};
	var gameOver = true;
	
	var players = {
		init: function() {
			player1.input = document.getElementById('player1').value;
			player1.val = true;
			player1.mark = "x";
			player2.input = document.getElementById('player2').value;
			player2.val = false;
			player2.mark = "o";

			// If custom input isn't entered, set to default
			if (player1.input === "") {
				player1.name = "Player 1";
			}
			else {
				player1.name = player1.input;
			}
			if (player2.input === "") {
				player2.name = "Player 2";
			}
			else {
				player2.name = player2.input;
			}

			console.log(player1);
			console.log(player2);

			// First turn defaults to player1
			currentTurn = player1;
			gameStatus.update(player1.name + " goes first");
		},
		nextTurn: function() {
			if (!currentTurn.val === player1.val) {
				currentTurn = player1;
				console.log("Current turn is now " + currentTurn.name);
			}
			else {
				currentTurn = player2;
			}
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
			gameStatus.update("Press Start Game");
		},
		isSpaceEmpty: function(space) {
			if (space.className == "blank") {
				console.log('space ' + space.dataset.place + " is blank, make move");
				this.makeMove(space);
			}
			else if (space.className == "x" || space.className == "y") {
				console.log('space is not available');
			}
			
		},
		makeMove: function(space) {
			this.cells[space.dataset.place] = currentTurn.mark;
			this.boardCells[space.dataset.place] = currentTurn.mark;
			console.log(this.cells);
			space.className = currentTurn.mark;
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
				gameOver = true;
			}
			else if (board.status == "draw") {
				gameOver = true;
			}
			else {
				players.nextTurn();
			}
		}
	};
	var gameStatus = {
		init: function() {
			this.bindEvents();
			board.init();
		},
		bindEvents: function() {
			document.getElementById("resetButton").addEventListener("click", function(){
				console.log('resetButton pressed');
				gameOver = true;
				board.init();
				players.init();
			});
			document.getElementById("startButton").addEventListener("click", function(){
				console.log('startButton pressed');
				gameOver = false;
				board.init();
				players.init();
				for (var i = 0; i < board.boardCells.length; ++i) {
					board.boardCells[i].addEventListener("click", function() {
						if (gameOver) {
							console.log('No game in progress');
						}
						else {
							board.isSpaceEmpty(this);
						}
						
					});
				}
			});
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
	});
	
	

})();
