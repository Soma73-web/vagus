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
        field: 'image_url',
      },
      imagePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'imagePath', // If your DB column is camelCase, otherwise use 'image_path'
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'display_order',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      addedBy: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'added_by',
      },
    },
    {
      tableName: "events",
      timestamps: true,
      createdAt: "created_at", // <-- This is the fix!
      updatedAt: "updated_at", // <-- This is the fix!
    },
  );

  return Event;
};
