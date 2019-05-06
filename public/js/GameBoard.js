var GameBoard = {
    init: function (board, playerOne, playerTwo) {
        this.board = board;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.turnCount = 1;
        this.selectedPlayer = this.playerOne;
        this.currentPossibleMoves = [];
    },

    getBlock: function (x, y) {
        return this.board[x][y];
    },

    isEmptyBlockForWeapon(x, y) {
        var block = this.getBlock(x, y);
        return block.type == TypesEnum.EMPTY;
    },

    isEmptyBlockForPlayer(x, y) {
        var block = this.getBlock(x, y);
        return block.type == TypesEnum.EMPTY && block.itemType != ItemEnum.WEAPON && block.itemType != ItemEnum.PLAYER;
    },

    isPossibleBlockToMove(x, y) {
        if ((x >= 0 && x <= 9) && (y >= 0 && y <= 9)) {
            var result = false;

            for (var i = 0; this.currentPossibleMoves.length; i++) {
                result = this.currentPossibleMoves[i].coordinate.x == x && this.currentPossibleMoves[i].coordinate.y == y;

                if (result) {
                    return result;
                }
            }

            return result;
        }
        return false;
    },

    updatePossibleMoves() {
        var x = this.selectedPlayer.position.x;
        var y = this.selectedPlayer.position.y;

        var isLeft = true;
        var isRight = true;
        var isUp = true;
        var isDown = true;

        for (var i = 0; i < this.currentPossibleMoves.length; i++) {
            var block = this.getBlock(this.currentPossibleMoves[i].coordinate.x, this.currentPossibleMoves[i].coordinate.y);
            block.type = TypesEnum.EMPTY;
        }

        this.currentPossibleMoves = [];

        var playerBlock = this.getBlock(x, y);
        playerBlock.type = TypesEnum.POSSIBLE;

        this.currentPossibleMoves.push(playerBlock);

        for (var i = 1; i <= 3; i++) {

            var down = y + i;
            var up = y - i;
            var left = x - i;
            var right = x + i;

            if (down < 10) {
                var block = this.getBlock(x, y + i);

                if (block.type == TypesEnum.EMPTY && block.itemType != ItemEnum.PLAYER && isDown) {
                    this.currentPossibleMoves.push(block);
                    block.type = TypesEnum.POSSIBLE;
                } else {
                    isDown = false;
                }
            }

            if (up >= 0) {
                var block = this.getBlock(x, y - i);

                if (block.type == TypesEnum.EMPTY && block.itemType != ItemEnum.PLAYER && isUp) {
                    this.currentPossibleMoves.push(block);
                    block.type = TypesEnum.POSSIBLE;
                } else {
                    isUp = false;
                }
            }

            if (left >= 0) {
                var block = this.getBlock(x - i, y);

                if (block.type == TypesEnum.EMPTY && block.itemType != ItemEnum.PLAYER && isLeft) {
                    this.currentPossibleMoves.push(block);
                    block.type = TypesEnum.POSSIBLE;
                } else {
                    isLeft = false;
                }
            }

            if (right < 10) {
                var block = this.getBlock(x + i, y);

                if (block.type == TypesEnum.EMPTY && block.itemType != ItemEnum.PLAYER && isRight) {
                    this.currentPossibleMoves.push(block);
                    block.type = TypesEnum.POSSIBLE;
                } else {
                    isRight = false;
                }
            }

        }
    },

    switchPlayers: function () {
        this.selectedPlayer.isShieldOn = false;
        this.selectedPlayer.hasShoot = false;

        this.updateTurnData();
        this.updatePossibleMoves();
        this.drawView();
    },

    positionPlayers: function () {
        var isPlayerOnePositionSelected = false;
        var isPlayerTwoPositionSelected = false;

        while (!isPlayerOnePositionSelected) {
            var playerX = Math.floor(Math.random() * 3);
            var playerY = Math.floor(Math.random() * 3);

            if (this.isEmptyBlockForPlayer(playerX, playerY)) {
                var playerOnePostion = Object.create(Coordinate);
                playerOnePostion.init(playerX, playerY);

                this.playerOne.position = playerOnePostion;

                var playerOneBlock = this.getBlock(playerX, playerY);
                playerOneBlock.itemType = ItemEnum.PLAYER;
                playerOneBlock.player = this.playerOne;

                isPlayerOnePositionSelected = true;
            }
        }

        while (!isPlayerTwoPositionSelected) {
            var playerX = this.playerOne.position.getX() + Math.floor(Math.random() * 6) + 2;
            var playerY = this.playerOne.position.getY() + Math.floor(Math.random() * 6) + 2;

            if (this.isEmptyBlockForPlayer(playerX, playerY)) {
                var playerTwoPostion = Object.create(Coordinate);
                playerTwoPostion.init(playerX, playerY);

                this.playerTwo.position = playerTwoPostion;

                var playerTwoBlock = this.getBlock(playerX, playerY);
                playerTwoBlock.itemType = ItemEnum.PLAYER;
                playerTwoBlock.player = this.playerTwo;

                isPlayerTwoPositionSelected = true;
            }
        }
    },

    positionObstacles: function () {
        var obstacleCount = 12;

        for (var i = 0; i < obstacleCount; i++) {
            var x = Math.floor(Math.random() * 9);
            var y = Math.floor(Math.random() * 9);

            var block = this.getBlock(x, y);
            block.type = TypesEnum.OBSTACLE;
        }
    },

    positionWeapons: function (weapons) {
        for (var i = 0; i < weapons.length; i++) {
            var selected = false;

            while (!selected) {
                var x = Math.floor(Math.random() * 9);
                var y = Math.floor(Math.random() * 9);

                var block = this.getBlock(x, y);

                if (this.isEmptyBlockForWeapon(x, y)) {
                    block.itemType = ItemEnum.WEAPON;
                    block.weapon = weapons[i];

                    selected = true;
                }
            }
        }
    },

    drawView: function () {
        drawView(this);
    },

    movePlayer: function (key, position) {
        var x = position.x;
        var y = position.y;

        var newX = position.x;
        var newY = position.y;

        if (key == 37) {
            newY = y - 1;
        } else if (key == 38) {
            newX = x - 1;
        } else if (key == 39) {
            newY = y + 1;
        } else if (key == 40) {
            newX = x + 1;
        }

        if (this.isPossibleBlockToMove(newX, newY)) {

            var block = this.getBlock(x, y);
            block.itemType = null;

            if (block.weapon != null) {
                block.itemType = ItemEnum.WEAPON;
            }

            var newBlock = this.getBlock(newX, newY);

            if (newBlock.itemType != null && (newBlock.itemType == ItemEnum.WEAPON)) {
                var oldWeapon = this.selectedPlayer.weapon;
                this.selectedPlayer.weapon = newBlock.weapon;
                newBlock.weapon = oldWeapon;

                updateWeaponView(this.playerOne.weapon, this.playerTwo.weapon);
            }

            this.selectedPlayer.position.x = newX;
            this.selectedPlayer.position.y = newY;

            newBlock.itemType = ItemEnum.PLAYER;
            newBlock.player = this.selectedPlayer;

            this.selectedPlayer.isShieldOn = false;

            if (this.selectedPlayer.id == 1) {
                this.playerOne = this.selectedPlayer;
            } else if (this.selectedPlayer.id == 2) {
                this.playerTwo = this.selectedPlayer;
            }

            updatePlayerDataView(this);
            drawBoard(this.board);

        } else {
            console.log('unable to move')
        }
    },

    move: function (key) {
        this.movePlayer(key, this.selectedPlayer.position);
    },

    shootPlayer: function () {
        var isDead = this.updateHealth();
        var health = null;
        this.selectedPlayer.hasShoot = false;

        if (this.selectedPlayer.id == 1) {
            health = this.playerTwo.health;
        } else if (this.selectedPlayer.id == 2) {
            health = this.playerOne.health;
        }

        updateHealthView(this.selectedPlayer, health, isDead);

        this.updateTurnData();
        this.updatePossibleMoves();
        updatePlayerDataView(this);
        this.drawView();
    },

    defendPlayer: function () {

        this.selectedPlayer.isShieldOn = true;
        this.selectedPlayer.hasShoot = false;

        this.updateTurnData();
        this.updatePossibleMoves();
        updatePlayerDataView(this);
        this.drawView();
    },

    isAttackPossible: function () {
        if (this.playerOne.position.y == this.playerTwo.position.y && Math.abs(this.playerOne.position.x - this.playerTwo.position.x) == 1 ||
            this.playerOne.position.x == this.playerTwo.position.x && Math.abs(this.playerOne.position.y - this.playerTwo.position.y) == 1) {
            return true;
        }

        return false;
    },

    updateTurnData: function () {
        this.turnCount -= 1;

        if (this.turnCount == 0) {

            this.turnCount = 1;

            if (this.selectedPlayer.id == 1) {
                this.selectedPlayer = this.playerTwo;
            } else if (this.selectedPlayer.id == 2) {
                this.selectedPlayer = this.playerOne;
            }
        }
    },

    updateHealth: function () {
        var isDead = false;

        if (this.selectedPlayer.id == 1) {
            isDead = this.playerTwo.hit(this.playerOne.shoot());
        } else if (this.selectedPlayer.id == 2) {
            isDead = this.playerOne.hit(this.playerTwo.shoot());
        }
        return isDead;
    }
}