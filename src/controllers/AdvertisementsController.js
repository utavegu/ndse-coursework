const Advertisement = require('../models/Advertisement');
const User = require('../models/User');

class AdvertisementsController {

  async createAdvertisement(request, response) {
    try {
      // if (request.isAuthenticated() && request.user) {
      // .send({message: "Авторизуйся, пес! Только для своих!"})
      // }
      // console.log(request.user);
      // const newAdvertisement = new Advertisement({...request.body, userId: request.user.id});
      // Но вообще это должен быть только авторизованный юзер... и вероятно доставаться из реквеста
      const MOCK_USER_ID = '639049280c6231fc1a3db863';
      const imagesPaths = request.files.length ? request.files.map(file => file.path) : []
      const user = await User.findById(MOCK_USER_ID).select(['-__v', '-passwordHash'])
      const newAdvertisement = new Advertisement({
        ...request.body,
        userId: user.id,
        images: imagesPaths
      });
      await newAdvertisement.save()
      response
        .status(201)
        .json({
          status: 'ok',
          data: {
            id: newAdvertisement.id,
            shortText: newAdvertisement.shortText,
            description: newAdvertisement.description,
            images: newAdvertisement.images,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              contactPhone: user.contactPhone,
            },
            createdAt: newAdvertisement.createdAt,
            updatedAt: newAdvertisement.updatedAt,
            tags: newAdvertisement.tags,
          }
        })
      // } else {
      //   response
      //     .status(401)
      //     .json({
      //       status: "error",
      //       error: "Данная операция требует аутентификации!"
      //     })
      // }
    } catch (error) {
      response
        .status(500)
        .json({
          status: 'error',
          error: error.message
        })
    }
  }

  async getAllAdvertisements(request, response) {
    try {
      const advertisements = await Advertisement.find().select('-__v') // TODO: Кроме удаленных! И в том же виде, как и при создании объявления
      response
        .status(200)
        .json({
          status: 'ok',
          data: advertisements,
        })
    } catch (error) {
      response
        .status(500)
        .json({
          status: 'error',
          error: error.message
        })
    }
  }

  async getAdvertisement(request, response) {
    const { id } = request.params
    try {
      const advertisement = await Advertisement.findById(id).select('-__v') // TODO: Кроме удаленных! И в том же виде, как и при создании объявления
      response
        .status(200)
        .json({
          status: 'ok',
          data: advertisement,
        })
    } catch (error) {
      response
        .status(404)
        .json({
          status: 'error',
          error: 'Такое объявление не найдено!'
        })
    }
  }

  async deleteAdvertisement(request, response) {
    try {
      response
        .status(200)
        .json({ testmessage: "Удаление объявления" })
    } catch (error) {
      response
        .status(404)
        .json({
          status: 'error',
          error: 'Такое объявление не найдено!'
        })
    }
  }

}

module.exports = new AdvertisementsController();