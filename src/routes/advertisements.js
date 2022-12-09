const express = require('express');
const router = express.Router();

const AdvertisementsController = require('../controllers/AdvertisementsController');
const config = require('../config');

const fileMulter = config.multer;
const { UPLOAD_IMAGES_LIMIT } = config.constants;

// Создание объявления
router.post(
  '/advertisements',
  AdvertisementsController.protectAdvertisement,
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
  AdvertisementsController.protectAdvertisement,
  AdvertisementsController.deleteAdvertisement
)

module.exports = router;