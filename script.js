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
    
    // Анимация появления элементов при прокрутке (оптимизировано для мобильных)
    const observerOptions = {
        threshold: window.innerWidth <= 768 ? 0.05 : 0.1,
        rootMargin: window.innerWidth <= 768 ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем задержку только на больших экранах
                if (window.innerWidth > 768) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, 100);
                } else {
                    entry.target.classList.add('animate-in');
                }
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
                child: formData.get('child'),
                favoriteSong: formData.get('favoriteSong') || '',
                toast: formData.get('toast'),
                games: formData.get('games')
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
    
    // Эффект параллакса только для десктопа (отключен для мобильных)
    let ticking = false;
    
    function updateParallax() {
        // Отключаем параллакс на мобильных устройствах для производительности
        if (window.innerWidth <= 768) {
            return;
        }
        
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
        if (!ticking && window.innerWidth > 768) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Параллакс только на больших экранах
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', requestTick);
    }
    
    // Добавляем CSS анимации динамически (оптимизированные для мобильных)
    const style = document.createElement('style');
    const isMobile = window.innerWidth <= 768;
    
    style.textContent = `
        section {
            opacity: 0;
            transform: translateY(${isMobile ? '20px' : '50px'});
            transition: all ${isMobile ? '0.3s' : '0.8s'} ease-out;
        }
        
        section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .radio-label {
            transform: translateX(0);
            transition: transform ${isMobile ? '0.1s' : '0.3s'} ease;
        }
        
        .radio-label:hover {
            transform: translateX(${isMobile ? '5px' : '10px'});
        }
        
        .gold-circle {
            transition: ${isMobile ? 'none' : 'transform 0.1s ease-out'};
        }
        
        @media (max-width: 768px) {
            * {
                will-change: auto !important;
            }
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
                    favoriteSong: data.favoriteSong,
                    toast: data.toast,
                    games: data.games,
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

🎵 РАЗВЛЕЧЕНИЯ:
🎶 Любимая песня: ${data.favoriteSong || 'Не указана'}
🎤 Тост/поздравление: ${data.toast}
🎉 Участие в конкурсах: ${data.games}

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
                                ${response.favoriteSong ? `<p><strong>🎶 Любимая песня:</strong> ${response.favoriteSong}</p>` : ''}
                                ${response.toast ? `<p><strong>🎤 Тост:</strong> ${response.toast}</p>` : ''}
                                ${response.games ? `<p><strong>🎉 Конкурсы:</strong> ${response.games}</p>` : ''}
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
        
        // Создаем читаемый текстовый формат
        const textData = responses.map((response, index) => {
            let text = `
=== ОТВЕТ №${index + 1} ===
👤 Имя: ${response.fullname}
📅 Дата: ${new Date(response.timestamp).toLocaleString('ru-RU')}
🚗 Трансфер: ${response.transfer}
🍽️ Еда: ${response.food}
🍷 Алкоголь: ${response.alcohol}
👶 Ребенок: ${response.child}`;

            // Добавляем развлечения, если они есть
            if (response.favoriteSong || response.toast || response.games) {
                text += `\n\n🎵 РАЗВЛЕЧЕНИЯ:`;
                if (response.favoriteSong) text += `\n🎶 Любимая песня: ${response.favoriteSong}`;
                if (response.toast) text += `\n🎤 Тост: ${response.toast}`;
                if (response.games) text += `\n🎉 Конкурсы: ${response.games}`;
            }
            
            return text;
        }).join('\n\n' + '='.repeat(50) + '\n\n');
        
        const finalText = `ОТВЕТЫ НА СВАДЕБНУЮ АНКЕТУ
Кирилл и Анастасия
Дата свадьбы: 03.10.2025
Всего ответов: ${responses.length}
Дата экспорта: ${new Date().toLocaleString('ru-RU')}

${'='.repeat(50)}
${textData}

${'='.repeat(50)}
Конец файла`;
        
        const dataBlob = new Blob([finalText], {type: 'text/plain;charset=utf-8'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `wedding-responses-${new Date().toISOString().split('T')[0]}.txt`;
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

// === ФУНКЦИОНАЛЬНОСТЬ ПОЖЕЛАНИЙ ===

// Переменные для пожеланий
let wishesData = [];
let displayedWishesCount = 0;
const wishesPerLoad = 5;

// Инициализация секции пожеланий (только форма отправки)
function initWishes() {
    loadWishesFromStorage();
    
    // Обработчик формы пожеланий
    const wishForm = document.getElementById('wishForm');
    if (wishForm) {
        wishForm.addEventListener('submit', handleWishSubmit);
    }
    
    // Скрываем секцию отображения пожеланий
    const wishesList = document.getElementById('wishesList');
    if (wishesList) {
        wishesList.style.display = 'none';
    }
    
    const loadMoreBtn = document.getElementById('loadMoreWishes');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
    
    console.log('✅ Секция пожеланий инициализирована (только отправка на почту)');
}

// Обработка отправки пожелания
async function handleWishSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.wish-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Получение данных формы
    const formData = new FormData(form);
    const wishData = {
        name: formData.get('wishName').trim(),
        text: formData.get('wishText').trim(),
        timestamp: new Date().toISOString(),
        id: generateWishId()
    };
    
    // Валидация
    if (!wishData.name || !wishData.text) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    if (wishData.text.length < 10) {
        alert('Пожелание должно содержать минимум 10 символов');
        return;
    }
    
    // Показать состояние загрузки
    submitBtn.classList.add('loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    try {
        // Сохранить пожелание
        await saveWish(wishData);
        
        // Показать сообщение об успехе
        showWishSuccessMessage(wishData.name);
        
        // Сбросить форму
        form.reset();
        
        console.log('✅ Пожелание отправлено на почту:', wishData);
        
    } catch (error) {
        console.error('❌ Ошибка добавления пожелания:', error);
        alert('Произошла ошибка при отправке пожелания. Попробуйте еще раз.');
    } finally {
        // Восстановить кнопку
        submitBtn.classList.remove('loading');
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Сохранение пожелания (только отправка на почту)
async function saveWish(wishData) {
    // Отправить на Formspree
    try {
        await sendWishByEmail(wishData);
        console.log('✅ Пожелание отправлено на почту');
    } catch (error) {
        console.error('❌ Ошибка отправки пожелания на почту:', error);
        throw error; // Показываем ошибку пользователю
    }
}

// Отправка пожелания на email через Formspree
async function sendWishByEmail(wishData) {
    const formData = new FormData();
    formData.append('name', `💌 Пожелание от ${wishData.name}`);
    formData.append('email', 'wishes@wedding.com');
    formData.append('subject', `Новое пожелание от ${wishData.name}`);
    formData.append('wishAuthor', wishData.name);
    formData.append('wishText', wishData.text);
    formData.append('wishDate', formatWishDate(wishData.timestamp));
    formData.append('_subject', `💌 Новое пожелание от ${wishData.name}`);
    
    try {
        const response = await fetch('https://formspree.io/f/xpwrjrnv', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Пожелание отправлено на Formspree');
        } else {
            throw new Error('Ошибка отправки на Formspree');
        }
    } catch (error) {
        console.error('❌ Ошибка отправки пожелания на Formspree:', error);
        throw error;
    }
}

// Функции Google Sheets удалены - пожелания отправляются только на почту

// Загрузка пожеланий (пустая функция - пожелания не отображаются)
function loadWishesFromStorage() {
    // Пожелания не отображаются, только отправляются на почту
    wishesData = [];
    console.log('📧 Пожелания отправляются только на почту, отображение отключено');
}

// Отображение пожеланий
function displayWishes() {
    const wishesList = document.getElementById('wishesList');
    const loadMoreBtn = document.getElementById('loadMoreWishes');
    
    console.log('🔍 displayWishes вызвана, wishesData:', wishesData);
    console.log('📊 Количество пожеланий:', wishesData.length);
    
    if (!wishesList) {
        console.error('❌ Элемент wishesList не найден');
        return;
    }
    
    // Скрыть пример, если есть реальные пожелания
    const exampleWish = wishesList.querySelector('.example-wish');
    if (wishesData.length > 0 && exampleWish) {
        exampleWish.style.display = 'none';
        console.log('👁️ Пример пожелания скрыт');
    } else if (wishesData.length === 0 && exampleWish) {
        exampleWish.style.display = 'block';
        console.log('👁️ Пример пожелания показан');
    }
    
    // Очистить существующие пожелания (кроме примера)
    const existingWishes = wishesList.querySelectorAll('.wish-item:not(.example-wish)');
    existingWishes.forEach(wish => wish.remove());
    console.log('🧹 Очищено существующих пожеланий:', existingWishes.length);
    
    // Показать пожелания
    const wishesToShow = wishesData.slice(0, displayedWishesCount + wishesPerLoad);
    console.log('📝 Пожелания к показу:', wishesToShow.length);
    
    wishesToShow.forEach((wish, index) => {
        if (index >= displayedWishesCount) {
            const wishElement = createWishElement(wish);
            wishesList.appendChild(wishElement);
            console.log('➕ Добавлено пожелание:', wish.name);
        }
    });
    
    displayedWishesCount = wishesToShow.length;
    
    // Управление кнопкой "Показать еще"
    if (loadMoreBtn) {
        if (displayedWishesCount < wishesData.length) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Показать еще (${wishesData.length - displayedWishesCount} осталось)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Обновить счетчик
    updateWishesCount();
    console.log('✅ displayWishes завершена, отображено:', displayedWishesCount);
}

// Создание элемента пожелания
function createWishElement(wish) {
    const wishDiv = document.createElement('div');
    wishDiv.className = 'wish-item';
    
    wishDiv.innerHTML = `
        <div class="wish-header">
            <div class="wish-author">💕 ${escapeHtml(wish.name)}</div>
            <div class="wish-date">${formatWishDate(wish.timestamp)}</div>
        </div>
        <div class="wish-text">${escapeHtml(wish.text)}</div>
    `;
    
    return wishDiv;
}

// Загрузка дополнительных пожеланий
function loadMoreWishes() {
    displayWishes();
}

// Обновление статистики пожеланий
function updateWishesStats() {
    const totalWishesEl = document.getElementById('totalWishes');
    const totalWishersEl = document.getElementById('totalWishers');
    
    if (totalWishesEl) {
        totalWishesEl.textContent = wishesData.length;
    }
    
    if (totalWishersEl) {
        // Подсчет уникальных имен
        const uniqueWishers = new Set(wishesData.map(wish => wish.name.toLowerCase()));
        totalWishersEl.textContent = uniqueWishers.size;
    }
}

// Обновление счетчика пожеланий
function updateWishesCount() {
    const wishesCountEl = document.getElementById('wishesCount');
    if (wishesCountEl) {
        const count = wishesData.length;
        wishesCountEl.textContent = count;
        
        // Изменение окончания слова
        const wishesCountContainer = wishesCountEl.parentElement;
        if (wishesCountContainer) {
            let word = 'пожеланий';
            if (count % 10 === 1 && count % 100 !== 11) {
                word = 'пожелание';
            } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
                word = 'пожелания';
            }
            wishesCountContainer.innerHTML = `<span id="wishesCount">${count}</span> ${word}`;
        }
    }
}

// Показ сообщения об успешном добавлении пожелания
function showWishSuccessMessage(name) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <h3>Спасибо, ${escapeHtml(name)}!</h3>
        <p>Ваше пожелание отправлено нам на почту!<br>Кирилл и Анастасия будут очень рады ❤️</p>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(message);
    
    setTimeout(() => {
        overlay.classList.add('show');
        message.classList.add('show');
    }, 10);
    
    const closeMessage = () => {
        overlay.classList.remove('show');
        message.classList.remove('show');
        
        setTimeout(() => {
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
            if (document.body.contains(message)) document.body.removeChild(message);
        }, 300);
    };
    
    overlay.addEventListener('click', closeMessage);
    setTimeout(closeMessage, 4000);
}

// Вспомогательные функции
function generateWishId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatWishDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Административные функции для пожеланий
function viewAllWishes() {
    if (wishesData.length === 0) {
        alert('Пожелания еще не добавлены');
        return;
    }
    
    const popup = document.createElement('div');
    popup.className = 'responses-popup';
    popup.innerHTML = `
        <div class="responses-content">
            <div class="responses-header">
                <h2>💌 Все пожелания (${wishesData.length})</h2>
                <button class="close-btn" onclick="closeWishesPopup()">&times;</button>
            </div>
            <div class="wishes-admin-list">
                ${wishesData.map(wish => `
                    <div class="response-item">
                        <h3>${escapeHtml(wish.name)}</h3>
                        <div class="response-details">
                            <p><strong>Дата:</strong> ${formatWishDate(wish.timestamp)}</p>
                            <p><strong>Пожелание:</strong></p>
                            <p style="font-style: italic; margin-left: 20px;">"${escapeHtml(wish.text)}"</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="responses-actions">
                <button class="download-btn" onclick="downloadWishes()">Скачать все пожелания</button>
                <button class="clear-btn" onclick="clearAllWishes()">Очистить все пожелания</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
}

function closeWishesPopup() {
    const popup = document.querySelector('.responses-popup');
    if (popup) document.body.removeChild(popup);
}

function downloadWishes() {
    try {
        const wishesText = wishesData.map(wish => 
            `${wish.name} (${formatWishDate(wish.timestamp)}):\n"${wish.text}"\n\n`
        ).join('');
        
        const dataBlob = new Blob([wishesText], {type: 'text/plain;charset=utf-8'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `wedding-wishes-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        
        console.log('✅ Пожелания скачаны');
    } catch (error) {
        console.error('❌ Ошибка скачивания пожеланий:', error);
    }
}

function clearAllWishes() {
    if (confirm('Вы уверены, что хотите удалить все пожелания? Это действие нельзя отменить.')) {
        wishesData = [];
        localStorage.removeItem('weddingWishes');
        displayedWishesCount = 0;
        displayWishes();
        updateWishesStats();
        closeWishesPopup();
        alert('Все пожелания удалены');
        console.log('🗑️ Все пожелания очищены');
    }
}

// Расширение функции активации админ-панели
const originalViewAllResponses = window.viewAllResponses;
window.viewAllResponses = function() {
    // Показать оригинальную админ-панель
    if (originalViewAllResponses) {
        originalViewAllResponses();
    }
    
    // Добавить кнопку просмотра пожеланий
    setTimeout(() => {
        const responsesActions = document.querySelector('.responses-actions');
        if (responsesActions && !document.getElementById('viewWishesBtn')) {
            const viewWishesBtn = document.createElement('button');
            viewWishesBtn.id = 'viewWishesBtn';
            viewWishesBtn.className = 'download-btn';
            viewWishesBtn.textContent = 'Посмотреть пожелания';
            viewWishesBtn.onclick = viewAllWishes;
            responsesActions.appendChild(viewWishesBtn);
        }
    }, 100);
};

// Инициализация пожеланий при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация пожеланий (с небольшой задержкой для загрузки DOM)
    setTimeout(async () => {
        await initWishes();
    }, 100);
    
    // Дополнительная оптимизация для мобильных устройств
    optimizeForMobile();
});

// Функция оптимизации для мобильных устройств
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    if (isMobile) {
        // Отключаем тяжелые CSS-анимации на мобильных
        const style = document.createElement('style');
        style.textContent = `
            .schedule-item,
            .schedule-icon,
            .feature-item,
            .gold-circle,
            .floating-heart,
            .sparkle {
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
            
            .schedule-item:hover,
            .feature-item:hover {
                transform: none !important;
                box-shadow: inherit !important;
            }
        `;
        
        if (isSmallMobile) {
            style.textContent += `
                .schedule-section {
                    will-change: auto !important;
                }
                
                .schedule-section * {
                    will-change: auto !important;
                }
                
                /* Принудительно убираем тяжелые эффекты */
                .schedule-section .decorative-elements {
                    display: none !important;
                }
                
                .schedule-item {
                    contain: layout style paint !important;
                }
            `;
        }
        
        document.head.appendChild(style);
        
        // Отключаем intersection observer анимации на мобильных для секции расписания
        const scheduleSection = document.querySelector('.schedule-section');
        if (scheduleSection) {
            scheduleSection.style.opacity = '1';
            const scheduleItems = scheduleSection.querySelectorAll('.schedule-item');
            scheduleItems.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'none';
                item.classList.add('animate-in');
            });
        }
        
        console.log('🚀 Мобильная оптимизация активирована');
    }
}

// Галерея фотографий
let currentGalleryType = '';
let currentPhotoIndex = 0;
let galleryPhotos = [];

// Конфигурация галерей с милыми подписями
const galleryConfig = {
    groom: {
        title: 'Фотографии жениха - Кирилл',
        photos: [
            {
                src: 'Жених/photo_2023-01-26_21-45-10.jpg',
                caption: '😎 Когда понял, что скоро женишься, а паника еще не наступила'
            },
            {
                src: 'Жених/photo_2023-05-17_00-22-54.jpg',
                caption: '🤵 Репетирую серьезный взгляд для ЗАГСа'
            },
            {
                src: 'Жених/photo_2023-07-30_22-54-24.jpg',
                caption: '☀️ Летнее настроение и мысли о будущей жене'
            },
            {
                src: 'Жених/photo_2023-08-15_00-09-01.jpg',
                caption: '🌙 Ночные размышления: "А кольцо точно красивое?"'
            },
            {
                src: 'Жених/photo_2023-09-14_22-24-42.jpg',
                caption: '🍂 Осенний романтик в поисках идеального предложения'
            },
            {
                src: 'Жених/photo_2023-09-14_22-24-40.jpg',
                caption: '📸 Когда друг сказал "улыбнись естественно"'
            },
            {
                src: 'Жених/photo_2023-09-15_23-29-22.jpg',
                caption: '🌟 Тот самый взгляд, который покорил Настю'
            },
            {
                src: 'Жених/photo_2023-09-17_21-42-00.jpg',
                caption: '💭 Думаю о том, как сказать "Да" красиво'
            },
            {
                src: 'Жених/photo_2024-04-04_10-41-04.jpg',
                caption: '🌸 Весенние планы на свадьбу уже в голове'
            },
            {
                src: 'Жених/photo_2024-04-13_00-24-38.jpg',
                caption: '🎯 Сосредоточенно выбираю костюм для торжества'
            },
            {
                src: 'Жених/photo_2024-05-28_12-23-35.jpg',
                caption: '☕ Утренний кофе и мысли о медовом месяце'
            },
            {
                src: 'Жених/photo_2024-05-30_12-26-40.jpg',
                caption: '😄 Когда понял, что невеста согласилась!'
            },
            {
                src: 'Жених/photo_2024-08-24_19-00-16.jpg',
                caption: '🎉 Праздничное настроение за несколько месяцев до свадьбы'
            },
            {
                src: 'Жених/photo_2024-11-30_14-19-51 (2).jpg',
                caption: '👔 Последние приготовления... Скоро большой день!'
            }
        ]
    },
    bride: {
        title: 'Фотографии невесты - Анастасия',
        photos: [
            {
                src: 'Невеста/photo_2023-02-24_18-38-41.jpg',
                caption: '💕 Когда еще не знала, что скоро станет невестой'
            },
            {
                src: 'Невеста/photo_2024-10-26_17-06-43.jpg',
                caption: '👰 Мечтаю о платье принцессы'
            },
            {
                src: 'Невеста/photo_2024-10-28_18-50-43.jpg',
                caption: '✨ Тот самый взгляд, который свел Кирилла с ума'
            },
            {
                src: 'Невеста/photo_2024-10-29_22-21-59.jpg',
                caption: '🌙 Вечерние мечты о свадебном дне'
            },
            {
                src: 'Невеста/photo_2024-11-13_15-38-52.jpg',
                caption: '🍃 Естественная красота будущей жены'
            },
            {
                src: 'Невеста/photo_2024-11-30_14-19-51.jpg',
                caption: '💍 Примеряю образ счастливой невесты'
            },
            {
                src: 'Невеста/photo_2025-05-17_09-23-14.jpg',
                caption: '🌺 Весенняя свежесть и предвкушение счастья'
            },
            {
                src: 'Невеста/photo_2025-06-06_20-18-37.jpg',
                caption: '😊 Улыбка, которая скажет "Да!" в ЗАГСе'
            },
            {
                src: 'Невеста/photo_2025-06-16_11-46-25.jpg',
                caption: '👑 Готовлюсь стать королевой этого дня'
            }
        ]
    }
};

function openGallery(type) {
    currentGalleryType = type;
    currentPhotoIndex = 0;
    galleryPhotos = galleryConfig[type].photos;
    
    if (galleryPhotos.length === 0) {
        alert('Фотографии скоро будут добавлены! 📸');
        return;
    }
    
    const modal = document.getElementById('galleryModal');
    const title = document.getElementById('galleryTitle');
    
    title.textContent = galleryConfig[type].title;
    
    // Загружаем первое фото
    loadPhoto(0);
    
    // Создаем миниатюры
    createThumbnails();
    
    // Показываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Добавляем обработчики клавиатуры
    document.addEventListener('keydown', handleKeyPress);
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Удаляем обработчики клавиатуры
    document.removeEventListener('keydown', handleKeyPress);
}

function loadPhoto(index) {
    if (index < 0 || index >= galleryPhotos.length) return;
    
    currentPhotoIndex = index;
    const mainPhoto = document.getElementById('mainPhoto');
    const photoData = galleryPhotos[index];
    
    mainPhoto.src = photoData.src;
    mainPhoto.alt = photoData.caption;
    
    // Обновляем подпись
    updatePhotoCaption(photoData.caption);
    
    // Обновляем активную миниатюру
    updateActiveThumbnail();
}

function previousPhoto() {
    const newIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : galleryPhotos.length - 1;
    loadPhoto(newIndex);
}

function nextPhoto() {
    const newIndex = currentPhotoIndex < galleryPhotos.length - 1 ? currentPhotoIndex + 1 : 0;
    loadPhoto(newIndex);
}

function createThumbnails() {
    const container = document.getElementById('galleryThumbnails');
    container.innerHTML = '';
    
    galleryPhotos.forEach((photoData, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = photoData.src;
        thumbnail.alt = photoData.caption;
        thumbnail.className = 'gallery-thumbnail';
        thumbnail.title = photoData.caption;
        thumbnail.onclick = () => loadPhoto(index);
        
        if (index === 0) {
            thumbnail.classList.add('active');
        }
        
        container.appendChild(thumbnail);
    });
}

function updateActiveThumbnail() {
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentPhotoIndex);
    });
}

function updatePhotoCaption(caption) {
    const captionElement = document.getElementById('photoCaption');
    if (captionElement) {
        captionElement.textContent = caption;
        captionElement.style.opacity = '1';
        
        // Скрываем подпись через 4 секунды, затем показываем снова
        setTimeout(() => {
            captionElement.style.opacity = '0.7';
        }, 4000);
    }
}

function handleKeyPress(e) {
    switch(e.key) {
        case 'Escape':
            closeGallery();
            break;
        case 'ArrowLeft':
            previousPhoto();
            break;
        case 'ArrowRight':
            nextPhoto();
            break;
    }
}

// Функция для динамического добавления фотографий с подписями
function addPhotosToGallery(type, photosWithCaptions) {
    if (galleryConfig[type]) {
        galleryConfig[type].photos = photosWithCaptions;
        console.log(`Добавлено ${photosWithCaptions.length} фотографий для ${type}`);
    }
}

// Пример использования:
// addPhotosToGallery('groom', [
//     { src: 'path/to/photo1.jpg', caption: 'Милая подпись к фото' },
//     { src: 'path/to/photo2.jpg', caption: 'Еще одна подпись' }
// ]);

// Закрытие галереи при клике вне изображения
document.addEventListener('click', function(e) {
    const modal = document.getElementById('galleryModal');
    if (e.target === modal) {
        closeGallery();
    }
});



// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация сайта...');
    
    // Обновляем счетчик
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Пожелания инициализируются в DOMContentLoaded
    
    // Инициализируем карту (если элемент существует)
    if (document.getElementById('map')) {
        initMap();
    }
    
    console.log('✅ Сайт инициализирован');
});

// Персонализированные аватары - интерактивные функции
let avatarDialogueIndex = 0;
let avatarStoryIndex = 0;
let isDialogueActive = false;

// Диалоги для персонажей
const avatarDialogues = [
    {
        groom: "Привет! 👋 Я Кирилл, и я очень рад, что ты заглянул на наш сайт!",
        bride: "Привет! 💕 Я Анастасия! Мы так счастливы поделиться с вами нашей радостью!"
    },
    {
        groom: "Знаешь, когда я впервые увидел Настю, сразу понял - это она! 😍",
        bride: "А я думала, что он просто милый сосед... Как же я ошибалась! 😊"
    },
    {
        groom: "Теперь мы готовимся к самому важному дню в нашей жизни! 💍",
        bride: "И мы хотим, чтобы ты был рядом с нами в этот особенный день! 👰"
    },
    {
        groom: "Обещаю, будет весело! Мы подготовили много сюрпризов! 🎉",
        bride: "Да, и не забудь заполнить анкету - нам важно знать твои предпочтения! 📝"
    }
];

// История любви для аватаров
const weddingStorySteps = [
    {
        groom: "Все началось с обычного 'Привет' в социальной сети... 📱",
        bride: "Кто бы мог подумать, что простое сообщение изменит всю мою жизнь! 💫"
    },
    {
        groom: "Наша первая встреча была в кафе... Я так волновался! ☕",
        bride: "А я три часа выбирала, что надеть! В итоге опоздала на 15 минут 😅"
    },
    {
        groom: "Помню наше первое 'Я тебя люблю'... Это было волшебно! ✨",
        bride: "Ты сказал это во время просмотра фильма, а я заплакала от счастья! 😭💕"
    },
    {
        groom: "А предложение руки и сердца... Я готовился целый месяц! 💍",
        bride: "И я сразу сказала 'ДА!', даже не дослушав до конца! 😂👰"
    },
    {
        groom: "Теперь мы готовимся стать семьей... Это лучшее приключение! 👫",
        bride: "И мы хотим, чтобы наши друзья были свидетелями нашего счастья! 💝"
    }
];

// Интересные факты
const funFactsData = [
    {
        icon: "🎮",
        text: "<strong>Кирилл:</strong> Может играть в игры по 12 часов подряд, но всегда находит время для Насти"
    },
    {
        icon: "🍰",
        text: "<strong>Настя:</strong> Печет самые вкусные торты в мире (Кирилл может подтвердить!)"
    },
    {
        icon: "😴",
        text: "<strong>Вместе:</strong> Рекордсмены по сну до 14:00 в выходные дни"
    },
    {
        icon: "🎬",
        text: "<strong>Любим:</strong> Смотреть фильмы с попкорном до 3 утра"
    },
    {
        icon: "🍕",
        text: "<strong>Кирилл:</strong> Знает все маршруты города наизусть - откуда и куда пройти"
    },
    {
        icon: "😴",
        text: "<strong>Настя:</strong> Может проспать весь день, если ее не разбудить"
    },
    {
        icon: "🚗",
        text: "<strong>Вместе:</strong> Можем заблудиться даже с навигатором"
    },
    {
        icon: "☕",
        text: "<strong>Утром:</strong> Настя - чай, Кирилл - кофе. Компромиссов нет! 😄"
    },
    {
        icon: "💻",
        text: "<strong>Кирилл:</strong> Может кодить всю ночь, забыв про еду и сон"
    }
];

// Функция начала диалога
function startAvatarDialogue() {
    if (isDialogueActive) {
        stopAvatarDialogue();
        return;
    }
    
    isDialogueActive = true;
    avatarDialogueIndex = 0;
    
    const button = document.querySelector('.avatar-controls .avatar-btn');
    button.textContent = '⏸️ Остановить диалог';
    
    // Скрываем интересные факты
    hideFunFacts();
    
    // Начинаем диалог
    playDialogue();
}

// Функция проигрывания диалога
function playDialogue() {
    if (!isDialogueActive || avatarDialogueIndex >= avatarDialogues.length) {
        stopAvatarDialogue();
        return;
    }
    
    const currentDialogue = avatarDialogues[avatarDialogueIndex];
    const groomBubble = document.getElementById('groomBubble');
    const brideBubble = document.getElementById('brideBubble');
    
    // Показываем реплику жениха
    showSpeechBubble(groomBubble, currentDialogue.groom);
    
    setTimeout(() => {
        // Скрываем реплику жениха и показываем невесты
        hideSpeechBubble(groomBubble);
        showSpeechBubble(brideBubble, currentDialogue.bride);
        
        setTimeout(() => {
            // Скрываем реплику невесты
            hideSpeechBubble(brideBubble);
            avatarDialogueIndex++;
            
            // Переходим к следующей реплике через паузу
            setTimeout(() => {
                if (isDialogueActive) {
                    playDialogue();
                }
            }, 1000);
        }, 3000);
    }, 3000);
}

// Функция остановки диалога
function stopAvatarDialogue() {
    isDialogueActive = false;
    avatarDialogueIndex = 0;
    
    const button = document.querySelector('.avatar-controls .avatar-btn');
    button.textContent = '💬 Начать диалог';
    
    // Скрываем все пузыри
    const groomBubble = document.getElementById('groomBubble');
    const brideBubble = document.getElementById('brideBubble');
    hideSpeechBubble(groomBubble);
    hideSpeechBubble(brideBubble);
}

// Функция показа пузыря речи
function showSpeechBubble(bubble, text) {
    if (!bubble) return;
    
    const textElement = bubble.querySelector('.bubble-text');
    if (textElement) {
        textElement.textContent = text;
    }
    bubble.classList.add('show');
}

// Функция скрытия пузыря речи
function hideSpeechBubble(bubble) {
    if (!bubble) return;
    bubble.classList.remove('show');
}

// Функция показа интересных фактов
function showFunFacts() {
    const funFactsElement = document.getElementById('funFacts');
    if (!funFactsElement) return;
    
    // Останавливаем диалог если он активен
    if (isDialogueActive) {
        stopAvatarDialogue();
    }
    
    // Генерируем случайные факты
    const shuffledFacts = [...funFactsData].sort(() => Math.random() - 0.5).slice(0, 4);
    
    // Обновляем содержимое
    const factsGrid = funFactsElement.querySelector('.facts-grid');
    if (factsGrid) {
        factsGrid.innerHTML = shuffledFacts.map(fact => `
            <div class="fact-item">
                <span class="fact-icon">${fact.icon}</span>
                <p>${fact.text}</p>
            </div>
        `).join('');
    }
    
    // Показываем факты
    funFactsElement.style.display = 'block';
    
    // Прокручиваем к фактам
    funFactsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Функция скрытия интересных фактов
function hideFunFacts() {
    const funFactsElement = document.getElementById('funFacts');
    if (funFactsElement) {
        funFactsElement.style.display = 'none';
    }
}

// Функция проигрывания истории любви
function playWeddingStory() {
    if (isDialogueActive) {
        stopAvatarDialogue();
    }
    
    hideFunFacts();
    
    avatarStoryIndex = 0;
    playStoryStep();
}

// Функция проигрывания шага истории
function playStoryStep() {
    if (avatarStoryIndex >= weddingStorySteps.length) {
        // История закончена
        const groomBubble = document.getElementById('groomBubble');
        const brideBubble = document.getElementById('brideBubble');
        
        setTimeout(() => {
            showSpeechBubble(groomBubble, "Вот такая у нас история! 💕");
            setTimeout(() => {
                hideSpeechBubble(groomBubble);
                showSpeechBubble(brideBubble, "И это только начало нашего пути! 🌟");
                setTimeout(() => {
                    hideSpeechBubble(brideBubble);
                }, 3000);
            }, 3000);
        }, 1000);
        return;
    }
    
    const currentStep = weddingStorySteps[avatarStoryIndex];
    const groomBubble = document.getElementById('groomBubble');
    const brideBubble = document.getElementById('brideBubble');
    
    // Показываем реплику жениха
    showSpeechBubble(groomBubble, currentStep.groom);
    
    setTimeout(() => {
        // Скрываем реплику жениха и показываем невесты
        hideSpeechBubble(groomBubble);
        showSpeechBubble(brideBubble, currentStep.bride);
        
        setTimeout(() => {
            // Скрываем реплику невесты
            hideSpeechBubble(brideBubble);
            avatarStoryIndex++;
            
            // Переходим к следующему шагу
            setTimeout(() => {
                playStoryStep();
            }, 1500);
        }, 4000);
    }, 4000);
}

// Обработчики для интерактивности аватаров
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем hover эффекты для аватаров
    const groomAvatar = document.getElementById('groomAvatar');
    const brideAvatar = document.getElementById('brideAvatar');
    
    if (groomAvatar) {
        groomAvatar.addEventListener('mouseenter', function() {
            if (!isDialogueActive) {
                const bubble = document.getElementById('groomBubble');
                const greetings = [
                    "Привет! Я Кирилл! 😊",
                    "Рад тебя видеть! 👋",
                    "Добро пожаловать на наш сайт! 🎉",
                    "Скоро свадьба! Волнуюсь! 😍"
                ];
                const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
                showSpeechBubble(bubble, randomGreeting);
            }
        });
        
        groomAvatar.addEventListener('mouseleave', function() {
            if (!isDialogueActive) {
                setTimeout(() => {
                    hideSpeechBubble(document.getElementById('groomBubble'));
                }, 2000);
            }
        });
    }
    
    if (brideAvatar) {
        brideAvatar.addEventListener('mouseenter', function() {
            if (!isDialogueActive) {
                const bubble = document.getElementById('brideBubble');
                const greetings = [
                    "Привет! Я Настя! 💕",
                    "Как дела? 😊",
                    "Спасибо, что зашел! ✨",
                    "Не могу дождаться свадьбы! 👰"
                ];
                const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
                showSpeechBubble(bubble, randomGreeting);
            }
        });
        
        brideAvatar.addEventListener('mouseleave', function() {
            if (!isDialogueActive) {
                setTimeout(() => {
                    hideSpeechBubble(document.getElementById('brideBubble'));
                }, 2000);
            }
        });
    }
    
    // Интерактивное сердечко
    const heartAnimation = document.querySelector('.heart-animation');
    if (heartAnimation) {
        heartAnimation.addEventListener('click', function() {
            // Создаем эффект взрыва сердечек
            createHeartExplosion(this);
            
            // Показываем романтичное сообщение
            const groomBubble = document.getElementById('groomBubble');
            const brideBubble = document.getElementById('brideBubble');
            
            if (!isDialogueActive) {
                showSpeechBubble(groomBubble, "Я люблю тебя, Настя! 💕");
                setTimeout(() => {
                    hideSpeechBubble(groomBubble);
                    showSpeechBubble(brideBubble, "И я тебя, Кирилл! 💖");
                    setTimeout(() => {
                        hideSpeechBubble(brideBubble);
                    }, 3000);
                }, 2000);
            }
        });
    }
});

// Функция создания эффекта взрыва сердечек
function createHeartExplosion(element) {
    const hearts = ['💕', '💖', '💗', '💘', '💝', '💞', '💟', '❤️', '🧡', '💛', '💚', '💙', '💜'];
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'fixed';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.fontSize = '1.5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transition = 'all 2s ease-out';
        
        document.body.appendChild(heart);
        
        // Анимируем разлет
        setTimeout(() => {
            const angle = (i / 12) * 2 * Math.PI;
            const distance = 100 + Math.random() * 100;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            heart.style.transform = `translate(${x}px, ${y}px) scale(0)`;
            heart.style.opacity = '0';
        }, 50);
        
        // Удаляем элемент
        setTimeout(() => {
            document.body.removeChild(heart);
        }, 2100);
    }
}

// Функция для анимации глаз, следящих за курсором
function initEyeTracking() {
    const pupils = document.querySelectorAll('.pupil');
    
    document.addEventListener('mousemove', function(e) {
        pupils.forEach(pupil => {
            const eye = pupil.parentElement;
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
            const distance = Math.min(3, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 50);
            
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    });
}

// Инициализируем отслеживание глаз при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initEyeTracking, 1000); // Задержка для корректной инициализации
});

console.log('🎭 Персонализированные аватары инициализированы!');

// Административные функции для отладки (только для разработки)
function debugWishes() {
    console.log('🔧 ОТЛАДКА ПОЖЕЛАНИЙ:');
    console.log('📊 wishesData:', wishesData);
    console.log('📊 localStorage:', localStorage.getItem('weddingWishes'));
    console.log('📊 displayedWishesCount:', displayedWishesCount);
    console.log('📊 wishesPerLoad:', wishesPerLoad);
    
    const wishesList = document.getElementById('wishesList');
    console.log('📊 wishesList element:', wishesList);
    
    if (wishesList) {
        const allWishes = wishesList.querySelectorAll('.wish-item');
        const realWishes = wishesList.querySelectorAll('.wish-item:not(.example-wish)');
        console.log('📊 Всего элементов пожеланий на странице:', allWishes.length);
        console.log('📊 Реальных пожеланий на странице:', realWishes.length);
    }
}

// Добавить тестовое пожелание
function addTestWish() {
    const testWish = {
        name: 'Тестер',
        text: 'Это тестовое пожелание для проверки работы системы!',
        timestamp: new Date().toISOString(),
        id: generateWishId()
    };
    
    wishesData.unshift(testWish);
    localStorage.setItem('weddingWishes', JSON.stringify(wishesData));
    
    console.log('✅ Тестовое пожелание добавлено:', testWish);
    
    // Обновить отображение
    displayWishes();
    updateWishesStats();
}

// Очистить все пожелания (для отладки)
function clearWishesDebug() {
    wishesData = [];
    localStorage.removeItem('weddingWishes');
    displayWishes();
    updateWishesStats();
    console.log('🗑️ Все пожелания очищены (отладка)');
}

// Добавляем функции в глобальную область для доступа из консоли
window.debugWishes = debugWishes;
window.addTestWish = addTestWish;
window.clearWishesDebug = clearWishesDebug;

// Удалить конкретное пожелание
function removeWishByContent(name, text) {
    const initialLength = wishesData.length;
    wishesData = wishesData.filter(wish => 
        !(wish.name.toLowerCase().includes(name.toLowerCase()) && 
          wish.text.toLowerCase().includes(text.toLowerCase()))
    );
    
    localStorage.setItem('weddingWishes', JSON.stringify(wishesData));
    
    const removedCount = initialLength - wishesData.length;
    console.log(`🗑️ Удалено пожеланий: ${removedCount}`);
    
    // Обновить отображение
    displayWishes();
    updateWishesStats();
    
    return removedCount;
}

// Добавляем функцию в глобальную область для доступа из консоли
window.removeWishByContent = removeWishByContent;

// Версия: 2.6 - Убрана функциональность Google Sheets - пожелания отправляются только на почту