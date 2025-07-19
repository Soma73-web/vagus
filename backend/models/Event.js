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
        defaultValue: "Event",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "general",
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
