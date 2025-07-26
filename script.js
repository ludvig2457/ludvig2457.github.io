// Переключатель темы
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Загружаем сохранённую тему из localStorage, если есть
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.toggle('dark-theme', savedTheme === 'dark');
    toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Обработка клика по кнопке темы
toggleBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-theme');
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Обработка формы обратной связи
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Собираем данные формы
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
        status.textContent = 'Пожалуйста, заполните все поля.';
        status.style.color = 'red';
        return;
    }

    // Здесь можно добавить отправку данных на сервер.
    // Пока используем mailto — открываем почтовый клиент пользователя.
    const mailtoLink = `mailto:your.email@example.com?subject=Сообщение с сайта Ludvig2457&body=Имя: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0A${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;

    status.textContent = 'Форма отправлена. Спасибо!';
    status.style.color = 'green';

    form.reset();
});
