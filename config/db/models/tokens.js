'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tokens.init({
    token: DataTypes.STRING,
    type: DataTypes.STRING,
    generated_by: DataTypes.NUMBER,
    expires_in: DataTypes.DATE,
    extended: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    closed_at: DataTypes.DATE,
    sent_as: DataTypes.STRING
  }, {
    timestamps: false,
    sequelize,
    modelName: 'tokens',
  });
  return tokens;
};