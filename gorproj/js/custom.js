// модальные окна
// успех
// 4 параметра (title, text, btnText, isReview), если isReview=true, то иконка заменяется на 🙌🏽, иначе просто галочка
if (window.location.pathname.endsWith('success-modal.html')) {
  openSuccessModal(
    "Заявка отправлена",
    "Спасибо, что заполнили форму! Наш менеджер свяжется с Вами в течение 15 минут",
    "",
    false
  );
}

// ошибка
// 3 параметра (title, text, btnText)
if (window.location.pathname.endsWith('error-modal.html')) {
  openErrorModal(
    "Что-то пошло не так", 
    "К сожалению, не получилось отправить заявку :( Попробуем еще раз?", 
    "Попробовать еще раз"
  );
}
