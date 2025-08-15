// calendar
// В интерфейс календаря передается массив занятых дат-строк (они будут недоступны)
// Формат 'YYYY-MM-DD'
const busyDates = ["2025-02-01", "2025-02-15", "2025-02-10", "2025-02-04", "2025-02-18"];
initCalendar("#datepicker", busyDates);


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
