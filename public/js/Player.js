var Player = {
    init: function (id, name, weapon) {
        this.id = id;
        this.name = name;
        this.weapon = weapon;
        this.health = 100;
        this.position = null;
        this.isShieldOn = false;
        this.hasShoot = false;
    },

    getWeapon: function () {
        return this.weapon;
    },

    setWeapon: function (weapon) {
        this.weapon = weapon;
    },

    hit: function (power) {
        var newPower = this.isShieldOn ? power / 2 : power;
        var health = this.health - newPower;

        this.isShieldOn = false;

        if (health <= 0) {
            this.health = 0;
            return true;
        } else {
            this.health = health;
            return false;
        }
    },

    shoot: function () {
        return this.weapon.power;
    },

    setPosition: function (position) {
        this.position = position;
    },

    getPosition: function () {
        return this.position;
    }
}