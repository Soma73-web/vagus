module.exports = (sequelize, DataTypes) => {
  const ImageGalleryItem = sequelize.define(
    "ImageGalleryItem",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "gallery_categories", key: "id" }, // ✅ Ensure table name is correct
      },
      image: { type: DataTypes.TEXT("long"), allowNull: false },
    },
    {
      tableName: "gallery_imagees", // ✅ Confirm your actual table name spelling in DB
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
