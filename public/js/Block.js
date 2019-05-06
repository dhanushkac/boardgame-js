var Block = {
    init: function (x, y) {
        var coordinate = Object.create(Coordinate);
        coordinate.init(x, y);

        this.coordinate = coordinate;
        this.type = TypesEnum.EMPTY;
        this.weapon = null;
        this.player = null;
        this.itemType = null;
    },

    getCoordinate: function () {
        return this.coordinate;
    },

    getType: function () {
        return this.type;
    },

    getItemType: function () {
        return this.itemType;
    },

    getWeapon: function () {
        return this.weapon;
    },

    getPlayer: function () {
        return this.player;
    }
}