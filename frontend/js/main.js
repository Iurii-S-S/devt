// Основной JavaScript для главной страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('TravelDream website loaded');
    
    // Проверка авторизации пользователя (имитация)
    checkAuthStatus();
    
    // Добавление плавной прокрутки для всех ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

function checkAuthStatus() {
    // В реальном приложении здесь была бы проверка токена или сессии
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (isLoggedIn && authButtons) {
        authButtons.innerHTML = `
            <span style="color: white; margin-right: 1rem;">Добро пожаловать!</span>
            <button class="btn-login" onclick="logout()">Выйти</button>
        `;
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
}