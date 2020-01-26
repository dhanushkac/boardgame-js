var TypesEnum = {
  EMPTY: { id: 0, name: "empty" },
  OBSTACLE: { id: 1, name: "obstacle" },
  POSSIBLE: { id: 2, name: "possible" }
};

var ItemEnum = {
  WEAPON: { id: 0, name: "weapon" },
  PLAYER: { id: 1, name: "player" }
};

var KeyEnum = {
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  LEFT: 37
};

/**
 * This function clears the view
 * @param {Element} element the element to be cleared
 */
function emptyView(element) {
  element.empty();
}

/**
 * This function updates the player data in the view
 * @param {GameBoard} board the active game board
 */
function updatePlayerDataView(board) {
  emptyView($(".player-one-turn"));
  emptyView($(".player-two-turn"));

  if (board.playerOne.isShieldOn) {
    var p = $(document.createElement("p")).html(
      "<i class='fas fa-shield-alt'></i> Shield is up"
    );
    $(".player-one-turn").append(p);
  }

  if (board.playerTwo.isShieldOn) {
    var p = $(document.createElement("p")).html(
      "<i class='fas fa-shield-alt'></i> Shield is up"
    );
    $(".player-two-turn").append(p);
  }

  if (board.selectedPlayer.id == 1 && board.selectedPlayer.health > 0) {
    var p = $(document.createElement("p")).text("Now your chance");
    $(".player-one-turn").append(p);

    if (board.isAttackPossible()) {
      board.selectedPlayer.hasShoot = true;
      addShootButton($(".player-one-turn"), board.shootPlayer.bind(board));
      addDefendButton($(".player-one-turn"), board.defendPlayer.bind(board));
    }
  } else if (board.selectedPlayer.id == 2 && board.selectedPlayer.health > 0) {
    var p = $(document.createElement("p")).text("Now your chance");
    $(".player-two-turn").append(p);

    if (board.isAttackPossible()) {
      board.selectedPlayer.hasShoot = true;
      addShootButton($(".player-two-turn"), board.shootPlayer.bind(board));
      addDefendButton($(".player-two-turn"), board.defendPlayer.bind(board));
    }
  }
}

/**
 * This function adds shoot button in the view
 * @param {Element} element the to add button
 * @param {Player} shootPlayer the player to add button
 */
function addShootButton(element, shootPlayer) {
  var button = $(document.createElement("input"));
  button.attr("type", "button");
  button.attr("value", "Shoot");
  button.addClass("btn shoot-btn");

  button.bind("click", shootPlayer);
  element.append(button);
}

/**
 * This function adds defend button in the view
 * @param {Element} element the to add button
 * @param {Player} defendPlayer the player to add button
 */
function addDefendButton(element, defendPlayer) {
  var button = $(document.createElement("input"));
  button.attr("type", "button");
  button.attr("value", "Defend");
  button.addClass("btn defend-btn");

  button.bind("click", defendPlayer);
  element.append(button);
}

/**
 * This function update the health view
 * @param {Player} selectedPlayer the player got hit
 * @param {number} health the health amount of the player
 * @param {boolean} isDead this defines the hit made the player dead of not
 */
function updateHealthView(selectedPlayer, health, isDead) {
  if (selectedPlayer.id == 1) {
    $(".player-2-health").text(health);
  } else if (selectedPlayer.id == 2) {
    $(".player-1-health").text(health);
  }

  gameEndNotification(isDead, selectedPlayer);
}

/**
 * This function triggers the game end notification when one player is dead
 * @param {boolean} isDead this defines the hit made the player dead of not
 * @param {Player} selectedPlayer the player got hit
 */
function gameEndNotification(isDead, selectedPlayer) {
  if (isDead) {
    var message = "Player " + selectedPlayer.name + " won!!";
    alert(message);
    window.location.reload();
  }
}

/**
 * This function initializes the game after the player names entered
 * @param {string} playerOneName the name of the player one
 * @param {string} playerTwoName the name of the player two
 */
function initGame(playerOneName, playerTwoName) {
  var gameBoardData = [];

  for (var i = 0; i < 10; i++) {
    var row = [];
    for (var j = 0; j < 10; j++) {
      var block = Object.create(Block);
      block.init(i, j);

      row.push(block);
    }

    gameBoardData.push(row);
  }

  var weapon = getDefaultWeapon();

  var playerOne = Object.create(Player);
  playerOne.init(1, playerOneName, weapon);

  var playerTwo = Object.create(Player);
  playerTwo.init(2, playerTwoName, weapon);

  var gameBoard = Object.create(GameBoard);
  gameBoard.init(gameBoardData, playerOne, playerTwo);

  gameBoard.positionObstacles();

  var weapons = getWeapons();
  gameBoard.positionWeapons(weapons);

  gameBoard.positionPlayers();

  gameBoard.updatePossibleMoves();

  gameBoard.drawView();

  $(window).keydown(function(e) {
    var isShown = $(".game").hasClass("show");

    if (isShown) {
      if (e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40) {
        gameBoard.move(e.which);
      }

      if (e.which == 13) {
        switchPlayers(gameBoard);
      }
    }
  });
}

/**
 * This function switches the players
 * @param {GameBoard} gameBoard the game board to be drawn
 */
function switchPlayers(gameBoard) {
  gameBoard.switchPlayers();
}

/**
 * This function draws the game board
 * @param {GameBoard} gameBoard the game board to be drawn
 */
function drawView(gameBoard) {
  drawPlayers(gameBoard.playerOne, gameBoard.playerTwo);
  drawBoard(gameBoard.board);
  updatePlayerDataView(gameBoard);
}

/**
 * This function draws the players in the board
 * @param {Player} playerOne the player one
 * @param {Player} playerTwo the player two
 */
function drawPlayers(playerOne, playerTwo) {
  var leftName = $(".left h2");
  leftName.text(playerOne.name);

  var leftHealth = $(".left p span");
  leftHealth.text(playerOne.health);

  var rightName = $(".right h2");
  rightName.text(playerTwo.name);

  var rightHealth = $(".right p span");
  rightHealth.text(playerTwo.health);

  updateWeaponView(playerOne.weapon, playerTwo.weapon);
}

/**
 * This function updates the weapon view for the players
 * @param {Weapon} playerOneWeapon the weapon of the player one
 * @param {Weapon} playerTwoWeapon the weapon of the player two
 */
function updateWeaponView(playerOneWeapon, playerTwoWeapon) {
  var weaponOne =
    "Weapon : " +
    playerOneWeapon.name +
    " <i class='" +
    playerOneWeapon.icon +
    "'></i>" +
    "<br>" +
    "Damage : " +
    playerOneWeapon.power;
  var weaponTwo =
    "Weapon : " +
    playerTwoWeapon.name +
    " <i class='" +
    playerTwoWeapon.icon +
    "'></i>" +
    "<br>" +
    "Damage : " +
    playerTwoWeapon.power;

  $(".player-one-weapon").html(weaponOne);
  $(".player-two-weapon").html(weaponTwo);
}

/**
 * This function draws the board
 * @param {GameBoard} gameBoard the game board to be drawn
 */
function drawBoard(gameBoard) {
  var container = $(".flexcontainer");
  container.empty();

  for (var i = 0; i < gameBoard.length; i++) {
    for (var j = 0; j < gameBoard[i].length; j++) {
      var blockType = gameBoard[i][j].type.name;
      var itemType = null;

      if (gameBoard[i][j].itemType != null) {
        itemType = gameBoard[i][j].itemType.name;
      }

      var div = $(document.createElement("div"));

      if (
        blockType == "empty" ||
        blockType == "possible" ||
        blockType == "obstacle"
      ) {
        div.addClass(blockType);
      }

      if (itemType == "weapon") {
        var weapon = $(document.createElement("i")).addClass(
          gameBoard[i][j].weapon.icon + " fa-3x " + itemType
        );
        div.append(weapon);
      } else if (itemType == "player") {
        var user = $(document.createElement("i")).addClass(
          "fa-3x fas fa-user" + " " + itemType + "_" + gameBoard[i][j].player.id
        );
        div.append(user);
      }

      container.append(div);
    }
  }
}

/**
 * This function defines the default weapon
 * @return the default weapon of the board
 */
function getDefaultWeapon() {
  var weapon = Object.create(Weapon);
  weapon.init("Bone", 10, "fas fa-bone");

  return weapon;
}

/**
 * This function initialized the initial weapons of the board
 */
function getWeapons() {
  var weapons = [];

  var weapon1 = Object.create(Weapon);
  weapon1.init("Bomb", 20, "fas fa-bomb");

  var weapon2 = Object.create(Weapon);
  weapon2.init("Hammer", 15, "fas fa-hammer");

  var weapon3 = Object.create(Weapon);
  weapon3.init("Baseball Ball", 15, "fas fa-baseball-ball");

  weapons.push(weapon1);
  weapons.push(weapon2);
  weapons.push(weapon3);

  return weapons;
}

/**
 * This function prints the current board in the console
 * @param {GameBoard} gameBoard the game board
 */
function print(gameBoard) {
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 10; j++) {
      console.log(gameBoard.getBlock(i, j).getObject());
    }
  }
}

/**
 * This function initializes the game.
 */
function init() {
  var gameBtn = $("#go-to-game");
  gameBtn.click(function() {
    var playerOneName = $("#player-one-name").val();
    var playerTwoName = $("#player-two-name").val();

    if (playerOneName != "" && playerTwoName != "") {
      initGame(playerOneName, playerTwoName);

      $(".player-names")
        .addClass("hide")
        .removeClass("show");
      $(".game")
        .addClass("show")
        .removeClass("hide");
    } else {
      alert("Please fill both player names");
    }
  });
}

init();
