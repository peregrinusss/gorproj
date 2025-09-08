// модальные окна
// успех
// 2 параметра (title, btnText)
if (window.location.pathname.endsWith("success-modal.html")) {
  openSuccessModal("", "", false);
}

// ошибка
// 2 параметра (title, btnText)
if (window.location.pathname.endsWith("error-modal.html")) {
  openErrorModal("", "Заполнить форму");
}
