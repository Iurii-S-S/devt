// Данные туров
const tours = [
    {
        id: 1,
        name: "Турция, Анталия",
        description: "Все включено 5* отель на берегу моря",
        price: 25000,
        country: "Турция",
        image: "turkey"
    },
    {
        id: 2,
        name: "Египет, Хургада",
        description: "Дайвинг и экскурсии к пирамидам",
        price: 30000,
        country: "Египет",
        image: "egypt"
    },
    {
        id: 3,
        name: "Тайланд, Пхукет",
        description: "Экзотический отдых на островах",
        price: 45000,
        country: "Тайланд",
        image: "thailand"
    },
    {
        id: 4,
        name: "Турция, Стамбул",
        description: "Экскурсионный тур по историческим местам",
        price: 35000,
        country: "Турция",
        image: "turkey"
    },
    {
        id: 5,
        name: "Египет, Шарм-эль-Шейх",
        description: "Роскошный отдых на Красном море",
        price: 40000,
        country: "Египет",
        image: "egypt"
    },
    {
        id: 6,
        name: "Тайланд, Бангкок",
        description: "Городской тур + пляжный отдых",
        price: 50000,
        country: "Тайланд",
        image: "thailand"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    displayTours(tours);
    
    // Обработчики фильтров
    const countryFilter = document.getElementById('countryFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (countryFilter) {
        countryFilter.addEventListener('change', filterTours);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterTours);
    }
});

function displayTours(toursToShow) {
    const container = document.getElementById('toursContainer');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (toursToShow.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Туры не найдены</p>';
        return;
    }
    
    toursToShow.forEach(tour => {
        const tourCard = document.createElement('div');
        tourCard.className = 'tour-card';
        
        tourCard.innerHTML = `
            <div class="tour-image" style="background-color: ${getColorForTour(tour.image)};"></div>
            <div class="tour-info">
                <h3>${tour.name}</h3>
                <p>${tour.description}</p>
                <div class="tour-price">${tour.price.toLocaleString()} ₽</div>
                <button class="btn-primary" style="margin-top: 1rem; width: 100%;" onclick="bookTour(${tour.id})">Забронировать</button>
            </div>
        `;
        
        container.appendChild(tourCard);
    });
}

function filterTours() {
    const country = document.getElementById('countryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    
    let filteredTours = tours;
    
    // Фильтр по стране
    if (country) {
        filteredTours = filteredTours.filter(tour => tour.country === country);
    }
    
    // Фильтр по цене
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filteredTours = filteredTours.filter(tour => {
            if (max) {
                return tour.price >= min && tour.price <= max;
            } else {
                return tour.price >= min;
            }
        });
    }
    
    displayTours(filteredTours);
}

function getColorForTour(imageType) {
    const colors = {
        'turkey': '#ff6b6b',
        'egypt': '#4ecdc4',
        'thailand': '#45b7d1'
    };
    
    return colors[imageType] || '#ddd';
}

function bookTour(tourId) {
    const tour = tours.find(t => t.id === tourId);
    
    if (!localStorage.getItem('isLoggedIn')) {
        if (confirm('Для бронирования тура необходимо войти в систему. Перейти на страницу входа?')) {
            window.location.href = 'auth.html';
        }
        return;
    }
    
    alert(`Тур "${tour.name}" забронирован! С вами свяжется наш менеджер.`);
}