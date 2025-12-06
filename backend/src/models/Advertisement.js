
const mongoose = require('mongoose');

// Singleton collection for all ads configuration
const AdvertisementSchema = new mongoose.Schema({
  heroSlides: [],
  audioPromo: [],
  promoBanners: [],
  smallPromoBanners: [],
  editorialCollage: [], // Nouveau champ pour le layout masonry
  shoppableVideos: [] // Nouveau champ pour les vidéos shoppable (Reels)
});

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
