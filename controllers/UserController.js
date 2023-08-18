import jwt from "jsonwebtoken"; // библиотека для coздыния токена
import bcrypt from 'bcrypt';    //библиотека для шифрования пароля

import UserModel from '../models/User.js';   //импортруем модель для пользователя

export const register = async (req, res) => {  //добавляем ригистрацию если она проходит валидацию
    try {
        const password = req.body.password;     //вытаскиваем и body наш пароль
        const salt = await bcrypt.genSalt(10);      //создем соль для шифровки
        const hash = await bcrypt.hash(password, salt);     //шифруем пароль с помощью соли

        const doc = new UserModel({     //создаем документ для создания пользователя вызываем функцию UserModel
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save()       //создаем пользователя и сохраняем в базе данных

        const token = jwt.sign(     //создаем токен который хранит шифрованую информацию
            {
                _id: user._id,
            },
            'secret123',     //указывается ключ для шифрования 
            {
                expiresIn: '30d',       //задаем время действия токена 30 дней
            },
        );

        const { passwordHash, ...userData } = user._doc;       //чтобы не возвращать хеш при регистриции

        res.json({      //если ошибок нет то возвращаем информацию о пользователе и токен
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Не удалось зарегестрироваться',
        })
    }
};

export const login = async (req, res) => {     //добавляем логинизацию
    try {
        const user = await UserModel.findOne({ email: req.body.email })     //ищем пользователя по почте
        
        if (!user) {    //проверяем на наличие пользователя
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)     //проверяем пароль пользователя если нашлась почта пользователя

        if (!isValidPass) {    //проверяем на правильность пароля
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign(     //создаем токен который хранит шифрованую информацию
            {
                _id: user._id,
            },
            'secret123',     //указывается ключ для шифрования 
            {
                expiresIn: '30d',       //задаем время действия токена 30 дней
            },
        );

        const { passwordHash, ...userData } = user._doc;       //чтобы не возвращать хеш при регистриции

        res.json({      //если ошибок нет то возвращаем информацию о пользователе и токен
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
};

export const getMe = async (req, res) => {    //создаем запрос для получения информации об пользователе
    try {       //делаем проверку
        const user = await User.findById(req.userId);   //создаем переменную куда записываем пользователя найденного по id
        
        if (!user) {        //делаем проверку, если пользователь не найден то возвращаем ошибку с таким текстом 
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }


        const { passwordHash, ...userData } = user._doc;       //чтобы не возвращать хеш при регистриции

        res.json({      //если ошибок нет то возвращаем информацию о пользователе и токен
            ...userData
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Нет  доступа',
        })
    }
};