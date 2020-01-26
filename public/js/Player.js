var Player = {
  /**
   * This function initializes the Player object.
   * @param {string} id the id of the player
   * @param {string} name the name of the player
   * @param {Weapon} weapon the initial weapon of the player
   */
  init: function(id, name, weapon) {
    this.id = id;
    this.name = name;
    this.weapon = weapon;
    this.health = 100;
    this.position = null;
    this.isShieldOn = false;
    this.hasShoot = false;
  },

  /**
   * This function provides the active weapon of the player.
   * @return the weapon of the player
   */
  getWeapon: function() {
    return this.weapon;
  },

  /**
   * This function sets the weapon for the player.
   * @param {Weapon} weapon the weapon to be set
   */
  setWeapon: function(weapon) {
    this.weapon = weapon;
  },

  /**
   * This function triggers the hit action.
   * @param {number} power the power of the hit
   */
  hit: function(power) {
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

  /**
   * This function triggers the shoot action.
   * @return power the power of the hit
   */
  shoot: function() {
    return this.weapon.power;
  },

  /**
   * This function sets the position of the player.
   * @param {Coordinate} position the position to set
   */
  setPosition: function(position) {
    this.position = position;
  },

  /**
   * This function gets the position of the player.
   */
  getPosition: function() {
    return this.position;
  }
};
