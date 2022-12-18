const Advertisement = require('../models/Advertisement');
const User = require('../models/User');

class AdvertisementsController {

  async createAdvertisement(request, response) {
    try {
      if (request.user) {
        const { body, user } = request;
        const imagesPaths = request.files?.length ? request.files.map(file => file.path) : []
        const newAdvertisement = new Advertisement({
          ...body,
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
                // email: user.email,
                // contactPhone: user.contactPhone,
              },
              createdAt: newAdvertisement.createdAt,
              // updatedAt: newAdvertisement.updatedAt,
              // tags: newAdvertisement.tags,
            }
          })
      } else {
        response
          .status(500)
          .json({
            status: 'error',
            error: 'Отсутствует пользователь!'
          })
      }
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
      const advertisements = await Advertisement.find({ isDeleted: false }).select('-__v')
      // TODO: Дичь какая-то... Поизучай документацию монги/монгуса.
      // Промис ол? Тоже звучит как дичь...
      /*
      const getUser = async (id) => {
        const user = await User.findById(id).select('name');
        console.log(user);
        return user;
      }
      const demonstrationAdvertisements = advertisements.map(adv => {
        const user = getUser(adv.userId);
        return {
          id: adv.id,
          shortText: adv.shortText,
          description: adv.description,
          images: adv.images,
          user: {
            id: adv.userId,
            name: user.name,
          },
          createdAt: adv.createdAt,
        }
      })
      */
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

  // TODO: Реализовано неправильно, нужно переделать... Хотя стоп. Похоже эта ручка и find - это две разные истории. А тут все верно
  async getAdvertisement(request, response) {
    const { id } = request.params
    try {
      const advertisement = await Advertisement.findOne({ _id: id, isDeleted: false }).select('-__v')
      const user = await User.findById(advertisement.userId).select('-__v')
      response
        .status(200)
        .json({
          status: 'ok',
          data: {
            id: advertisement.id,
            shortText: advertisement.shortText,
            description: advertisement.description,
            images: advertisement.images,
            user: {
              id: user.id,
              name: user.name,
            },
            createdAt: advertisement.createdAt,
          },
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
    const { id } = request.params
    const advertisement = await Advertisement.findById(id).select('-__v')
    try {
      if (String(advertisement.userId) === request.user.id) {
        if (advertisement.isDeleted) {
          return response
            .status(403) // TODO: Или 404?
            .json({
              status: 'error',
              error: 'Это объявление уже удалено'
            })
        }
        await Advertisement.findByIdAndUpdate(
          id,
          { isDeleted: true },
        )
        response
          .status(200)
          .json({ testmessage: `Объявление "${advertisement.shortText}" успешно удалено` })
      } else {
        response
          .status(403)
          .json({
            status: 'error',
            error: 'Вы не можете удалить чужое объявление'
          })
      }
    } catch (error) {
      response
        .status(404)
        .json({
          status: 'error',
          error: 'Такое объявление не найдено!'
        })
    }
  }

  protectAdvertisement(request, response, next) {
    if (!request.isAuthenticated()) {
      return response
        .status(401)
        .json({
          status: 'error',
          error: 'Вам нужно войти в систему, чтобы получить доступ к этому функционалу'
        })
    }
    next()
  }

}

module.exports = new AdvertisementsController();