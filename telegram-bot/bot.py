from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import requests

# Обработчик команды /start
def start(update, context):
    context.user_data.clear()
    update.message.reply_text('Здравствуйте! Как мы можем к вам обращаться?')

# Обработчик ответа на имя
def get_name(update, context):
    context.user_data['name'] = update.message.text
    update.message.reply_text('Напишите, пожалуйста, ваш номер телефона')

# Обработчик ответа на телефон
def get_phone(update, context):
    context.user_data['phone'] = update.message.text
    update.message.reply_text('Оцените качество сервиса от 1 до 5, где 5 — это лучшая оценка')

# Обработчик ответа на оценку
def get_rating(update, context):
    context.user_data['rating'] = int(update.message.text)
    update.message.reply_text('Оставьте, пожалуйста, комментарий:')

# Обработчик ответа на комментарий
def get_comment(update, context):
    context.user_data['comment'] = update.message.text

    requests.post("https://msk-postamat.online/api/reviews", json = {
        "comment": context.user_data['comment'],
        "rating": int(context.user_data['rating']),
        "postamat_id": "P-5000",
        "user_name": context.user_data['name'],
        "user_phone": str(context.user_data['phone'])
    })

    context.user_data.clear()

    update.message.reply_text(
        f'Спасибо за обратную связь! Она помогает сделать качество сервиса лучше \n\n Если вы хотите оставить ещё один отзыв, нажмите /start'
    )


# Обработчик неожиданного ответа
def unexpected(update, context):
    update.message.reply_text('Извините, я не понимаю вас. Введите, пожалуйста, корректный ответ.')

# Обработчик ошибок
def error(update, context):
    update.message.reply_text('Что-то пошло не так...')

def handle_message(update, context):
    if 'rating' in context.user_data:
        return get_comment(update, context)
    elif 'phone' in context.user_data:
        return get_rating(update, context)
    elif 'name' in context.user_data:
        get_phone(update, context)
    else:
        return get_name(update, context)

# Основная логика бота
def main():
    # Создание бота и привязка токена
    updater = Updater('6073408484:AAGpdvK6_mA_C4vEdYfrRJSJM1u4-OwK1Gk', use_context=True)
    dp = updater.dispatcher

    # Обработчики диалога
    dp.add_handler(CommandHandler('start', start))
    dp.add_handler(MessageHandler(Filters.all, handle_message))

    # Обработка ошибок
    dp.add_error_handler(error)

    # Запуск бота
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()