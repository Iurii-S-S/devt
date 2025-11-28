// Обработка формы входа
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Простая валидация
            if (!email || !password) {
                showMessage('Заполните все поля', 'error');
                return;
            }
            
            // Имитация успешного входа
            showMessage('Вход выполнен успешно!', 'success');
            
            // В реальном приложении здесь был бы AJAX запрос
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Валидация
            if (!fullName || !email || !phone || !password || !confirmPassword) {
                showMessage('Заполните все поля', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Пароли не совпадают', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Пароль должен содержать минимум 6 символов', 'error');
                return;
            }
            
            // Имитация успешной регистрации
            showMessage('Регистрация прошла успешно!', 'success');
            
            // В реальном приложении здесь был бы AJAX запрос
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 1500);
        });
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});