module.exports = (sequelize, DataTypes) => {
  const Faculty = sequelize.define('Faculty', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING, // store file path or URL
      allowNull: true,
    },
  }, {
    tableName: 'faculty',
    timestamps: true,
  });
  return Faculty;
}; 