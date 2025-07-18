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
        field: 'image_url',
      },
      announcementType: {
        type: DataTypes.ENUM("admission", "achievement", "general"),
        defaultValue: "general",
        field: 'announcement_type',
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_enabled',
      },
      showOnHomepage: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'show_on_homepage',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'startDate',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_date',
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin",
        field: 'created_by',
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
