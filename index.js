import express from "express"; // библиотека для запуска сервера
import multer from "multer"; // библиотека для запуска сервера
import cors from "cors";       //библиотека для запуска сервера

import mongoose from "mongoose";    // библиотека для работы с базой данных

import {loginValidation, postCreateValidation, registerValidation} from './validations/validations.js';  //мпортируем валидацю пользователя(обязательно довалять расширение(.js) в конце)
import { handleValidationErrors, checkAuth } from './utils/index.js';       //импортируем все утилиты
import {UserController, PostController} from './controllers/index.js'   //импортируем все контроллеры

mongoose.connect('mongodb+srv://admin:cfyxjc@cluster0.0jmxa7f.mongodb.net/blog?retryWrites=true&w=majority')    //подключаем базу данных с логином admin и паролем
    .then(() => { console.log("DB ok") })   //проверяем подключились ли мы к базе данных
    .catch((error) => { console.log("DB error", error) })    //если ловим ошибку то оповещаем об этом
    
const app = express(); // запускаем библиотеку в приложении

const storage = multer.diskStorage({    //создаем хранилище
    destination: (_, __, cb) => {    //задаем путь файла
        cb(null, 'uploads');     //записываем в папку upload
    },
    filename: (_, file, cb) => {    //задаем название файла
        cb(null, file.originalname);     //записываем оригинальное имя файла
    },
});  
const upload = multer({ storage });     //применяем логику stirage  на экспрес

app.use(express.json());    //вызываем логику из express json который позволяет читать запросы с json
app.use(cors());    //используем функцию cors для вызова запроса откуда угодно
app.use('/uploads', express.static('uploads'));     //деалем проверку, если прийдет запрос на uploads то возьми функцию static на наличие передаваемой картинки

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)       //создаем запрос логинизации
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)     //создаем запрос регистрации
app.get('/auth/me', checkAuth, UserController.getMe)        //создаем запрос получения информации

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {    //создаем запрос для загрузки картинки
    res.json({
        url:`/uploads/${req.file.originalname}`,    //если все прошло успешно то загружаем картнику с оригинальным названием
    })
});   

app.get('/posts', PostController.getAll);   //делаем запрос для получения всех статей
app.get('/posts/:id', PostController.getOne);   //делаем запрос  для получения одной статьи по id
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);      //делаем запрос для создания статьи
app.delete('/posts/:id', checkAuth, PostController.remove);    //делаем запрос для удаления статьи
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);     //делаем запрос для обновления статьи

app.listen(4444, (error) => {  // запускаем сервер на порте 4444
    if (error) {  //ловим ошибку 
        return console.log(error)  // возвращем ошибку
    }
    console.log('Server OK')    //если все прошло без ошибок возвращаем эту фразу
});