module.exports = (sequelize, DataTypes) => {
  const ImageGalleryItem = sequelize.define(
    "ImageGalleryItem",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "gallery_categories", key: "id" },
      },
      image: { type: DataTypes.TEXT("long"), allowNull: false },
    },
    {
      tableName: "gallery_images",
      timestamps: false,
    },
  );

  ImageGalleryItem.associate = (models) => {
    ImageGalleryItem.belongsTo(models.GalleryCategory, {
      foreignKey: "categoryId",
      as: "category",
    });
  };

  return ImageGalleryItem;
};
