var Weapon = {
  /**
   * This function initializes the Weapon object.
   * @param {string} name name of the weapon
   * @param {number} power power of the weapon
   * @param {string} icon icon of the weapon
   */
  init: function(name, power, icon) {
    this.name = name;
    this.power = power;
    this.icon = icon;
  }
};
