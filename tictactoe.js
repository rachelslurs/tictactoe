
(function TicTacToe() {

	// Global variables and DOM selectors
	var player1= {}; 
	var player2= {};
	var currentTurn = {};
	var gameInProgress = false;
	
	function Player(playerNumber, pointsOnWin, playerMark, playerBool, minOrMax) {
		this.playerNumber = playerNumber;
		this.points = 0;
		this.pointsOne= pointsOnWin/10; // +/-1
		this.pointsTwo=pointsOnWin; // +/-10
		this.pointsThree=pointsOnWin*10; // +/-100
		this.score = 0;
		this.name = playerMark;
		this.el = document.querySelector("input#"+playerNumber);
		this.el.disabled=false;
		this.mark = playerMark;
		this.bool = playerBool;
		this.minOrMax = minOrMax;
	}
	var players = {
		init: function() {
			player1 = new Player('player1',10,'X',true,"max");
			player2 = new Player('player2',-10,'O',false,"min");
			console.log('default',player1,player2);
		},
		save: function() {
			if (player1.el.value) {
				player1.name=player1.el.value;
			}
			if (player2.el.value) {
				player2.name=player2.el.value;
			}
			console.log('saving',player1,player2);

			// Disable player name changes during game
			player1.el.disabled=true;
			player2.el.disabled=true;

			// First turn defaults to player1
			currentTurn = player1;
			currentTurn.el.className = "current";
			player2.el.className = "";
		},
		nextTurn: function() {
			if (!currentTurn.bool === player1.bool) {
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
			this.cells = ["","","","","","","","",""];
			for (var i = 0; i < this.boardCells.length; i++) {
				this.boardCells[i].className="blank";
				this.cells[i]="";
			}
		},
		isSpaceEmpty: function(space) {
			if (gameInProgress) {
				if (space.className == "blank") {
					var index=space.dataset.place;
					this.makeMove(space,index);
				}
				else {
					console.log('space is not available');
				}
			}
			else {
				console.log('Game is not in progress.');
			}
		},
		getAvailableMoves: function() {
			var empties=[];
			for (var i = 0; i < this.cells.length; i++) {
				if (!this.cells[i]) {
					empties.push(i);
				}
			}
			return empties;
		},
		makeMove: function(space,index) {
			this.cells[index] = currentTurn.mark;
			this.boardCells[index].className = currentTurn.mark;
			console.log("Data:",this.cells);
			console.log("DOM:",this.boardCells);
			space.className = currentTurn.mark;
			cellData = currentTurn.mark;
			this.check();
		},
		check: function() {
			if (gameStatus.isWinner() == "win") {
				board.status = "win";
				gameStatus.update(currentTurn.name + " wins!");
				currentTurn.score+=currentTurn.pointsOnWin * 10;
				document.querySelector('p#'+currentTurn.playerNumber).innerText=Math.abs(currentTurn.score/10);
				gameInProgress = false;
				document.getElementById("startButton").disabled = false;
			}
			else if (gameStatus.isDraw() == "draw") {
				board.status = "draw";
				gameStatus.update("Draw.");
				gameInProgress = false;
				document.getElementById("startButton").disabled = false;
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
				console.log('resetButton pressed. Enable start button.');
				gameInProgress = false;
				document.getElementById("startButton").disabled = false;
				gameStatus.init();
				gameStatus.update("No game in progress");
			});
			document.getElementById("startButton").addEventListener("click", function(){
				console.log('startButton pressed. Disabled while game is in progress.');
				this.disabled=true;
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
			document.querySelector('h4').innerText = text;
		},
		isWinner: function() {
			// Review whether any winning combinations have been made
			var lines = [
			  [0,1,2],
			  [3,4,5],
			  [6,7,8],
			  [0,3,6],
			  [1,4,7],
			  [2,5,8],
			  [0,4,8],
			  [2,4,6]
			 ];
			for(var i=0; i<lines.length; i++) {
				var a, b, c;
				// cells holding 'x', 'o', or ""
				a = board.cells[lines[i][0]];
				b = board.cells[lines[i][1]];
				c = board.cells[lines[i][2]];
				if (a == b && a == c && a != "") {
					// Three in a row
					console.log('three are the same',a,b,c);
					console.log(currentTurn.minOrMax);
					console.log(currentTurn.pointsThree);
					return "win";
				}
				else if 
					((a == b && a !== "" && (c == "" || c.length < 1)) || 
					(a == c && c !== "" && (b == "" || b.length < 1)) || 
					(b == c && b !== "" && (a == "" || a.length < 1))) {
					// Two in a row and third is blank
					console.log('2 are the same', a,b,c);
					console.log(currentTurn.name);
					currentTurn.score+=currentTurn.pointsTwo;
					console.log(currentTurn.pointsTwo);
					console.log(currentTurn.score);
				}
				else if ((a !== b && b == c && b == "") ||
						(b !== c && a == c && a == "") ||
						(a !== c && b == c && c == "")) {
						// One in a row and other two spaces are blank
							console.log('1 in the row', a,b,c);
						}
			}
		},
		isDraw: function() {
			// Review if there are still potential winning combinations
			// See if any of the win-dices are still available
			// if not, we have a draw
			console.log("isDraw method");
			minimax.init();
			minimax.possibleMoves(currentTurn);
			//return "draw";
		}
	};
	var minimax = {
		init: function() {
			var currentScore = 0;
			var bestScore = 0;
		},
		possibleMoves: function(player) {
			console.log(player,board.getAvailableMoves());
		},
		possibleScore: function() {

		}
	};

	// Wait until DOM is loaded to init gameStatus
	document.addEventListener("DOMContentLoaded", function() {
		console.log('DOM loaded');
		gameStatus.init();
		gameStatus.update("No game in progress");
		// Bind events to DOM once
		gameStatus.bindEvents();
	});
})();
