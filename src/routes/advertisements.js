const express = require('express');
const router = express.Router();

const AdvertisementsController = require('../controllers/AdvertisementsController');
const config = require('../config');

const fileMulter = config.multer;
const UPLOAD_IMAGES_LIMIT = 5 // TODO: Тоже в конфиг можно, в принципе. Раздел "константы"

// Создание объявления
router.post(
  '/advertisements',
  /*
  (request, _, next) => {
    if (!request.isAuthenticated()) {
      return console.log('Недостаточно прав для данного действия!')
    }
    next()
  },
  */
  fileMulter.array('images', UPLOAD_IMAGES_LIMIT),
  AdvertisementsController.createAdvertisement
)

// Запрос всех объявлений
router.get(
  '/advertisements',
  AdvertisementsController.getAllAdvertisements
)

// Запрос одного объявления
router.get(
  '/advertisements/:id',
  AdvertisementsController.getAdvertisement
)

// Удаление объявления
router.delete(
  '/advertisements/:id',
  AdvertisementsController.deleteAdvertisement
)

module.exports = router;