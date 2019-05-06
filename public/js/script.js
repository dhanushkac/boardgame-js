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

function emptyView(element) {
    element.empty();
}

function updatePlayerDataView(board) {
    emptyView($(".player-one-turn"));
    emptyView($(".player-two-turn"));

    if (board.playerOne.isShieldOn) {
        var p = $(document.createElement("p")).html("<i class='fas fa-shield-alt'></i> Shield is up");
        $(".player-one-turn").append(p);
    }

    if (board.playerTwo.isShieldOn) {
        var p = $(document.createElement("p")).html("<i class='fas fa-shield-alt'></i> Shield is up");
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
};

function addShootButton(element, shootPlayer) {
    var button = $(document.createElement("input"));
    button.attr("type", "button");
    button.attr("value", "Shoot");
    button.addClass("btn shoot-btn");

    button.bind("click", shootPlayer);
    element.append(button);
};

function addDefendButton(element, defendPlayer) {
    var button = $(document.createElement("input"));
    button.attr("type", "button");
    button.attr("value", "Defend");
    button.addClass("btn defend-btn");

    button.bind("click", defendPlayer);
    element.append(button);
};

function updateHealthView(selectedPlayer, health, isDead) {
    if (selectedPlayer.id == 1) {
        $(".player-2-health").text(health);
    } else if (selectedPlayer.id == 2) {
        $(".player-1-health").text(health);
    }

    gameEndNotification(isDead, selectedPlayer);
};

function gameEndNotification(isDead, selectedPlayer) {
    if (isDead) {
        var message = "Player " + selectedPlayer.name + " won!!";
        alert(message);
        window.location.reload();
    }
};

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

    $(window).keydown(function (e) {
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

};

function switchPlayers(gameBoard) {
    gameBoard.switchPlayers();
}

function drawView(gameBoard) {

    drawPlayers(gameBoard.playerOne, gameBoard.playerTwo);
    drawBoard(gameBoard.board);
    updatePlayerDataView(gameBoard);
};

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
};

function updateWeaponView(playerOneWeapon, playerTwoWeapon) {

    var weaponOne = "Weapon : " + playerOneWeapon.name + " <i class='" + playerOneWeapon.icon + "'></i>" + "<br>" + "Damage : " + playerOneWeapon.power;
    var weaponTwo = "Weapon : " + playerTwoWeapon.name + " <i class='" + playerTwoWeapon.icon + "'></i>" + "<br>" + "Damage : " + playerTwoWeapon.power;

    $(".player-one-weapon").html(weaponOne);
    $(".player-two-weapon").html(weaponTwo);
}

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

            if (blockType == "empty" || blockType == "possible" || blockType == "obstacle") {
                div.addClass(blockType);
            }

            if (itemType == "weapon") {
                var weapon = $(document.createElement("i")).addClass(gameBoard[i][j].weapon.icon + " fa-3x " + itemType);
                div.append(weapon);
            } else if (itemType == "player") {
                var user = $(document.createElement("i")).addClass("fa-3x fas fa-user" + " " + itemType + "_" + gameBoard[i][j].player.id);
                div.append(user);
            }

            container.append(div);

        }
    }
}

function getDefaultWeapon() {
    var weapon = Object.create(Weapon);
    weapon.init("Bone", 10, "fas fa-bone");

    return weapon;
}

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

function print(gameBoard) {
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            console.log(gameBoard.getBlock(i, j).getObject());
        }
    }
}

function init() {

    var gameBtn = $("#go-to-game");
    gameBtn.click(function () {

        var playerOneName = $("#player-one-name").val();
        var playerTwoName = $("#player-two-name").val();

        if (playerOneName != "" && playerTwoName != "") {
            initGame(playerOneName, playerTwoName);

            $(".player-names").addClass("hide").removeClass("show");
            $(".game").addClass("show").removeClass("hide");
        } else {
            alert("Please fill both player names");
        }
    });

}

init();