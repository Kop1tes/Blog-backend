import mongoose from "mongoose";    // импортируем библиотеку для работы с базой данных

const UserSchema = new mongoose.Schema({    //создаем новую схему для создания пользователя
    fullName: {     //у польхователя должно быть имя
        type: String,   //тип именя будет строка
        required: true,      //имя должно быть обязательным
    },
    email: {       //у пользователя должна быть почта
        type: String,      //тип строка
        required: true,     //почта должна быть обязательной
        unique: true,      //почта должна быть уникальной
    },
    passwordHash: {     //у пользователя должен быть пароль зашифрованый
        type: String,   //тип строка
        required: true,     //пароль должен быть обязательно
    },
    avatarUrl: String,      //у пользователя может быть аватарка
}, {
    timestamps: true,       //схема при создании должна показать фремя создания сущности
})

export default mongoose.model('User', UserSchema);      //экспортируем схему для переиспользования