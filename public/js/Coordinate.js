var Coordinate = {
  /**
   * This function initializes the Coordinate object.
   * @param {string} x the position of the x axis
   * @param {string} y the position of the y axis
   */
  init: function(x, y) {
    this.x = x;
    this.y = y;
  },

  /**
   * This function provides the x value of the Coordinate object.
   * @return the x value
   */
  getX: function() {
    return this.x;
  },

  /**
   * This function provides the y value of the Coordinate object.
   * @return the y value
   */
  getY: function() {
    return this.y;
  }
};
