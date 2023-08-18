import jwt from 'jsonwebtoken'  //библиотека для создания токена

export default (req, res, next) => {    //создаем функцию для  проверки аутентификации 
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');    //создаем переменную куда кидаем нформацию из запроса авторизации для проверки наличия токена, если есть то убираем слово Bearer

    if (token) {    //делаем проверку если ..., иначе верни строку с текстом
        try {
            const decoded = jwt.verify(token, 'secret123');     //делаем декодинг, расшифровываем токен с помощью функции verify и ключ secret123

            req.userId = decoded._id;   // добавляем в req то что смогли расшифровать (наш id)
            next();
        } catch (error) {
            return res.status(403).json({   //возвращает строку с таким текстом
            message: 'Нет доступа',
        });
        }
    } else {
        return res.status(403).json({   //возвращает строку с таким текстом
            message: 'Нет доступа',
        });
    };
};