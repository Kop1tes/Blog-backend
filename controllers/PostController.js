import express from 'express';
import PostModel from '../models/Post.js'    //импортируем модель для создания поста

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();   //создаем переменную куда записываем все найденные статьи, создаем лимит не больше 5 статей и выполняем запрос

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);       //возвращаем массив всех найденных тегов
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    };
}

export const getAll = async (req, res) => {     //создаем переменную получения всех статей
    try {
        const posts = await PostModel.find().populate('user').exec();   //создаем переменную куда записываем все найденные статьи, создаем связь по пользователя и выполняем запрос
        
        res.json(posts);       //возвращаем массив всех найденных статей
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    };
};

// export const getOne = async (req, res) => {     //создаем переменную получения всех статей
//   try {
//     const postId = req.params.id;

//     PostModel.findOneAndUpdate(
//       {
//         _id: postId,
//       },
//       {
//         $inc: { viewsCount: 1 },
//       },
//       {
//         returnDocument: 'after',
//       },
//       (err, doc) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({
//             message: 'Не удалось вернуть статью',
//           });
//         }

//         if (!doc) {
//           return res.status(404).json({
//             message: 'Статья не найдена',
//           });
//         }

//         res.json(doc);
//       },
//     ).populate('user');
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Не удалось получить статьи',
//     });
//   }
// };

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    ).populate('user');

    if (!updatedPost) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    // Добавьте логирование
    console.log('Созданный пост:', post);

    if (post._id) {
      res.status(201).json({
        message: 'Статья успешно создана',
        post: post,
      });
    } else {
      res.status(500).json({
        message: 'Не удалось создать статью. Отсутствует _id в ответе сервера.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedDoc = await PostModel.findOneAndDelete({
            _id: postId,
        });

        if (!deletedDoc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const update = async (req, res) => {     //создаем переменную обновления статьи
    try {
        const postId = req.params.id;       //запсываю в переменную найденное id

        await PostModel.updateOne({     //с помощью функции находим статью по id и обновляем ее
            _id: postId,
        },
            {
                title: req.body.title,     //указываем что должен быть заголовок
                text: req.body.text,     //указываем что должен быть текст
                imageUrl: req.body.imageUrl,     //указываем что должно быть изображение
                user: req.userId,     //делаем проверку авторизации по id пользователя
                tags: req.body.tags.split(','),     //указываем что должны быть теги
            },
        );

        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось обновить статью',
        })
    }
}