var Block = {
  /**
   * This function initializes the Block object.
   * @param {string} x the position of the x axis
   * @param {string} y the position of the y axis
   */
  init: function(x, y) {
    var coordinate = Object.create(Coordinate);
    coordinate.init(x, y);

    this.coordinate = coordinate;
    this.type = TypesEnum.EMPTY;
    this.weapon = null;
    this.player = null;
    this.itemType = null;
  },

  /**
   * This function provides the coordinate of the Block object.
   * @return the coordinate of the block
   */
  getCoordinate: function() {
    return this.coordinate;
  },

  /**
   * This function provides the type of the Block object.
   * @return the type of the block
   */
  getType: function() {
    return this.type;
  },

  /**
   * This function provides the item type of the Block object.
   * @return the item type of the block
   */
  getItemType: function() {
    return this.itemType;
  },

  /**
   * This function provides the weapon of the Block object.
   * @return the weapon of the block
   */
  getWeapon: function() {
    return this.weapon;
  },

  /**
   * This function provides the player object of the Block object.
   * @return the player of the block, if not null
   */
  getPlayer: function() {
    return this.player;
  }
};
