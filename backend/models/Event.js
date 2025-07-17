module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Event Image",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      imagePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      addedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "events",
      timestamps: true,
    },
  );

  return Event;
};
