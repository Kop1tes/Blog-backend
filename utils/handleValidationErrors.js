import { validationResult } from 'express-validator';   //функция для проверки ошибок

export default (req, res, next) => {    // создаем проверку на ошибки валидации
    const errors = validationResult(req);       //получаем все ошибки которые не прошли валидацию в запросе
        if (!errors.isEmpty()) {    //если ошибки не пусты то возвращаем статус 400 и все ошибки которые провалидировали
            return res.status(400).json(errors.array())
    }
    
    next(); //если ошибок нет то иди далее
}