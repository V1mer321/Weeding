document.addEventListener('DOMContentLoaded', function() {
    
    // Дата свадьбы
    const weddingDate = new Date('2025-10-03T15:00:00').getTime();
    
    // Функция обновления обратного отсчета
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Обновляем значения на странице
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Если дата прошла
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = '00';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
        }
    }
    
    // Обновляем счетчик каждую секунду
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Плавная прокрутка при клике на стрелку
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.querySelector('.countdown-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Навигация
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Плавная прокрутка для навигации
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за секциями для анимации
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Анимация для золотых кружков
    const goldCircles = document.querySelectorAll('.gold-circle');
    goldCircles.forEach((circle, index) => {
        circle.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Обработка формы анкеты
    const surveyForm = document.getElementById('surveyForm');
    if (surveyForm) {
        surveyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = surveyForm.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Показать состояние загрузки
            submitBtn.classList.add('loading');
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            
            // Собрать данные формы
            const formData = new FormData(surveyForm);
            const data = {
                fullname: formData.get('fullname'),
                transfer: formData.get('transfer'),
                food: formData.get('food'),
                alcohol: formData.get('alcohol'),
                child: formData.get('child')
            };
            
            try {
                // Отправить данные через email
                await submitToEmail(data);
                
                // Показать сообщение об успехе
                showSuccessMessage();
                
                // Сбросить форму
                surveyForm.reset();
                
            } catch (error) {
                console.error('Ошибка отправки:', error);
                alert('Произошла ошибка при отправке анкеты. Пожалуйста, попробуйте еще раз.');
            } finally {
                // Восстановить кнопку
                submitBtn.classList.remove('loading');
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });
    }
    
    // Инициализация карты
    function initMap() {
        const mapContainer = document.getElementById('map');
        const mapBtn = document.querySelector('.map-btn');
        
        if (mapContainer && mapBtn) {
            mapBtn.addEventListener('click', function() {
                // Координаты ресторана Эдем в Смоленске
                const lat = 54.78749; // Широта ресторана Эдем
                const lng = 31.90973; // Долгота ресторана Эдем
                
                // Создаем карту
                const map = L.map('map').setView([lat, lng], 13);
                
                // Добавляем тайлы карты
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
                
                // Добавляем маркер
                const marker = L.marker([lat, lng]).addTo(map);
                marker.bindPopup('<b>Ресторан Эдем</b><br>2-я Дачная ул., 12, Смоленск<br>Место проведения торжественного ужина').openPopup();
                
                // Скрываем кнопку после инициализации карты
                mapBtn.style.display = 'none';
            });
        }
    }
    
    initMap();
    
    // Эффект параллакса для декоративных элементов
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.gold-circle');
        const speed = 0.3;
        
        parallaxElements.forEach((element, index) => {
            const yPos = -(scrolled * speed * (index + 1) * 0.1);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Добавляем CSS анимации динамически
    const style = document.createElement('style');
    style.textContent = `
        section {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease-out;
        }
        
        section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .radio-label {
            transform: translateX(0);
            transition: transform 0.3s ease;
        }
        
        .radio-label:hover {
            transform: translateX(10px);
        }
        
        .gold-circle {
            transition: transform 0.1s ease-out;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .nav-menu {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .nav-menu.active {
            max-height: 300px;
        }
        
        @media (min-width: 769px) {
            .nav-menu {
                display: flex !important;
                max-height: none;
                position: static;
                background: transparent;
                padding: 0;
                transform: none;
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Добавляем обработчик для анимации гамбургера
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
    });
    

    
    // Плавное появление секций при скролле
    setTimeout(() => {
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('animate-in');
            }, index * 200);
        });
    }, 500);
    
    // Плавное появление секций при загрузке
    setTimeout(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.classList.add('animate-in');
        }
    }, 100);
    
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Закрываем мобильное меню при изменении размера
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }, 250);
    });
    
    // Секретная активация кнопки для просмотра ответов
    // Комбинация: Ctrl + Shift + A
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyA') {
            event.preventDefault();
            const adminBtn = document.querySelector('.view-responses-btn');
            if (adminBtn) {
                if (adminBtn.classList.contains('visible')) {
                    adminBtn.classList.remove('visible');
                    console.log('🔒 Админ-панель скрыта');
                } else {
                    adminBtn.classList.add('visible');
                    console.log('🔓 Админ-панель активирована');
                    
                    // Показать уведомление
                    showAdminNotification();
                }
            }
        }
    });
    
    // Добавляем красивый эффект для кнопок
    const buttons = document.querySelectorAll('.submit-btn, .map-btn, .close-popup');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Функция для отправки данных через email
async function submitToEmail(data) {
    console.log('📧 Отправляем данные:', data);
    
    // ВАРИАНТ 1: Formspree (рекомендуемый)
    // Замените YOUR_FORM_ID на ваш ID из formspree.io
    const FORMSPREE_ID = 'mgvylenq'; // Ваш реальный Formspree ID
    
    if (FORMSPREE_ID !== 'YOUR_FORM_ID') {
        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subject: `Новый ответ на свадебную анкету от ${data.fullname}`,
                    name: data.fullname,
                    transfer: data.transfer,
                    food: data.food,
                    alcohol: data.alcohol,
                    child: data.child,
                    timestamp: new Date().toLocaleString('ru-RU')
                })
            });
            
            if (response.ok) {
                console.log('✅ Данные отправлены через Formspree');
                saveToLocalStorage(data);
                return Promise.resolve();
            }
        } catch (error) {
            console.error('❌ Ошибка Formspree:', error);
        }
    }
    
    // ВАРИАНТ 2: Fallback - mailto (если Formspree не настроен)
    const currentDate = new Date().toLocaleString('ru-RU');
    
    const emailBody = `
Новый ответ на свадебную анкету
Дата отправки: ${currentDate}

👤 Имя и фамилия: ${data.fullname}
🚗 Трансфер: ${data.transfer}
🍽️ Предпочтения по еде: ${data.food}
🍷 Алкоголь: ${data.alcohol}
👶 Ребенок: ${data.child}

---
Отправлено с сайта-приглашения на свадьбу
    `.trim();
    
    // Создаем mailto ссылку
    const mailtoLink = `mailto:lykianovaoff@gmail.com?subject=Новый ответ на свадебную анкету от ${data.fullname}&body=${encodeURIComponent(emailBody)}`;
    
    // Сохраняем данные в локальное хранилище для истории
    saveToLocalStorage(data);
    
    // Открываем почтовый клиент
    window.location.href = mailtoLink;
    
    console.log('✅ Почтовый клиент открыт для отправки');
    return Promise.resolve();
}

// Функция сохранения в локальное хранилище
function saveToLocalStorage(data) {
    try {
        // Получаем существующие данные
        const existingData = JSON.parse(localStorage.getItem('weddingResponses') || '[]');
        
        // Добавляем новый ответ с временной меткой
        const newResponse = {
            ...data,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        existingData.push(newResponse);
        
        // Сохраняем обратно
        localStorage.setItem('weddingResponses', JSON.stringify(existingData));
        
        console.log('💾 Данные сохранены локально');
        
        // Показываем количество ответов
        console.log(`📊 Всего ответов сохранено: ${existingData.length}`);
        
    } catch (error) {
        console.error('❌ Ошибка сохранения в localStorage:', error);
    }
}

// Функция для просмотра всех ответов
function viewAllResponses() {
    try {
        const responses = JSON.parse(localStorage.getItem('weddingResponses') || '[]');
        
        if (responses.length === 0) {
            alert('Пока нет сохраненных ответов');
            return;
        }
        
        // Создаем красивое окно с ответами
        const popup = document.createElement('div');
        popup.className = 'responses-popup';
        popup.innerHTML = `
            <div class="responses-content">
                <div class="responses-header">
                    <h2>Все ответы на анкету (${responses.length})</h2>
                    <button onclick="closeResponsesPopup()" class="close-btn">×</button>
                </div>
                <div class="responses-list">
                    ${responses.map((response, index) => `
                        <div class="response-item">
                            <h3>${response.fullname}</h3>
                            <div class="response-details">
                                <p><strong>📅 Дата:</strong> ${new Date(response.timestamp).toLocaleString('ru-RU')}</p>
                                <p><strong>🚗 Трансфер:</strong> ${response.transfer}</p>
                                <p><strong>🍽️ Еда:</strong> ${response.food}</p>
                                <p><strong>🍷 Алкоголь:</strong> ${response.alcohol}</p>
                                <p><strong>👶 Ребенок:</strong> ${response.child}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="responses-actions">
                    <button onclick="downloadResponses()" class="download-btn">💾 Скачать все ответы</button>
                    <button onclick="clearAllResponses()" class="clear-btn">🗑️ Очистить все</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Добавляем стили
        if (!document.getElementById('responses-styles')) {
            const styles = document.createElement('style');
            styles.id = 'responses-styles';
            styles.textContent = `
                .responses-popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .responses-content {
                    background: white;
                    border-radius: 20px;
                    max-width: 800px;
                    max-height: 80vh;
                    overflow-y: auto;
                    width: 100%;
                }
                .responses-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 25px;
                    border-bottom: 2px solid #eee;
                }
                .responses-header h2 {
                    font-family: 'Great Vibes', cursive;
                    color: #4ecdcc;
                    margin: 0;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #999;
                }
                .response-item {
                    padding: 20px 25px;
                    border-bottom: 1px solid #eee;
                }
                .response-item h3 {
                    color: #4ecdcc;
                    margin-bottom: 10px;
                    font-family: 'Montserrat', sans-serif;
                }
                .response-details p {
                    margin: 5px 0;
                    font-family: 'Montserrat', sans-serif;
                }
                .responses-actions {
                    padding: 25px;
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                .download-btn, .clear-btn {
                    padding: 12px 25px;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 500;
                }
                .download-btn {
                    background: #4ecdcc;
                    color: white;
                }
                .clear-btn {
                    background: #e74c3c;
                    color: white;
                }
            `;
            document.head.appendChild(styles);
        }
        
    } catch (error) {
        console.error('❌ Ошибка просмотра ответов:', error);
        alert('Ошибка при загрузке ответов');
    }
}

// Функции для управления ответами
function closeResponsesPopup() {
    const popup = document.querySelector('.responses-popup');
    if (popup) document.body.removeChild(popup);
}

function downloadResponses() {
    try {
        const responses = JSON.parse(localStorage.getItem('weddingResponses') || '[]');
        const dataStr = JSON.stringify(responses, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `wedding-responses-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('✅ Файл с ответами скачан');
    } catch (error) {
        console.error('❌ Ошибка скачивания:', error);
    }
}

function clearAllResponses() {
    if (confirm('Вы уверены, что хотите удалить все ответы? Это действие нельзя отменить.')) {
        localStorage.removeItem('weddingResponses');
        closeResponsesPopup();
        alert('Все ответы удалены');
        console.log('🗑️ Все ответы очищены');
    }
}

// Функция показа сообщения об успехе
function showSuccessMessage() {
    // Создать overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Создать сообщение
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <h3>Спасибо!</h3>
        <p>Ваши ответы успешно отправлены.<br>Мы учтем все ваши пожелания!</p>
    `;
    
    // Добавить в DOM
    document.body.appendChild(overlay);
    document.body.appendChild(message);
    
    // Показать с анимацией
    setTimeout(() => {
        overlay.classList.add('show');
        message.classList.add('show');
    }, 10);
    
    // Закрыть при клике
    overlay.addEventListener('click', closeSuccessMessage);
    
    // Автоматически закрыть через 3 секунды
    setTimeout(closeSuccessMessage, 3000);
    
    function closeSuccessMessage() {
        overlay.classList.remove('show');
        message.classList.remove('show');
        
                 setTimeout(() => {
             if (document.body.contains(overlay)) document.body.removeChild(overlay);
             if (document.body.contains(message)) document.body.removeChild(message);
         }, 300);
     }
 }

// Функция уведомления об активации админ-панели
function showAdminNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4ecdcc 0%, #44a08d 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = '🔓 Админ-панель активирована';
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Добавляем стили анимации
    if (!document.getElementById('admin-animations')) {
        const style = document.createElement('style');
        style.id = 'admin-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
} 