module.exports = (sequelize, DataTypes) => {
  const PopupAnnouncement = sequelize.define(
    "PopupAnnouncement",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      announcementType: {
        type: DataTypes.ENUM("admission", "achievement", "general"),
        defaultValue: "general",
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      showOnHomepage: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin",
      },
    },
    {
      tableName: "popup_announcements",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return PopupAnnouncement;
};
