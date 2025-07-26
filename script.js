const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

// Загрузка темы из localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-theme');
  toggleBtn.textContent = '☀️';
} else {
  toggleBtn.textContent = '🌙';
}

// Переключение темы
toggleBtn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-theme');
  toggleBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Обработка формы
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    status.textContent = 'Пожалуйста, заполните все поля.';
    status.style.color = 'crimson';
    return;
  }

  // Простейшая валидация email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    status.textContent = 'Пожалуйста, введите корректный email.';
    status.style.color = 'crimson';
    return;
  }

  // Отправка почты через mailto
  const mailtoLink = `mailto:your.email@example.com?subject=Сообщение с сайта Ludvig2457&body=Имя: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0A${encodeURIComponent(message)}`;

  window.location.href = mailtoLink;

  status.textContent = 'Форма готова к отправке почтовому клиенту.';
  status.style.color = 'limegreen';

  form.reset();
});
