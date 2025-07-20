module.exports = (sequelize, DataTypes) => {
  const CategorizedGalleryImage = sequelize.define('CategorizedGalleryImage', {
    // Define your fields here, for example:
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Add other fields as needed
  }, {
    tableName: 'categorized_gallery_images',
    timestamps: false,
  });

  // Associations can be defined here if needed
  // CategorizedGalleryImage.belongsTo(sequelize.models.GalleryCategory, { foreignKey: 'category_id' });

  return CategorizedGalleryImage;
}; 