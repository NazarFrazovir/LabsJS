class Slider {
    constructor(selector, config) {
      // Отримуємо елемент-контейнер по селектору
      this.container = document.querySelector(selector);
  
      // Налаштування: масив слайдів, тривалість анімації, автопрокрутка та показ стрілок/крапок
      this.slides = config.slides || [];
      this.duration = config.duration || 500;
      this.autoplay = config.autoplay || false;
      this.showArrows = config.showArrows !== false;
      this.showDots = config.showDots !== false;
  
      this.current = 0; // Поточний активний слайд
      this.timer = null; // Таймер для autoplay
  
      this.init(); // Ініціалізація слайдера
    }
  
    init() {
      this.container.innerHTML = ''; // Очищаємо контейнер
  
      // Створюємо "дорожку" для слайдів
      this.track = document.createElement('div');
      this.track.className = 'slider-track';
  
      // Створюємо кожен слайд та додаємо його до дорожки
      this.slides.forEach(text => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.textContent = text;
        this.track.appendChild(slide);
      });
  
      // Додаємо дорожку в контейнер
      this.container.appendChild(this.track);
  
      // Якщо увімкнено стрілки — додаємо їх
      if (this.showArrows) {
        this.addArrows();
      }
  
      // Якщо увімкнено крапки — додаємо їх
      if (this.showDots) {
        this.addDots();
      }
  
      // Додаємо підтримку клавіатурної навігації (←/→)
      this.addKeyboardSupport();
  
      // Встановлюємо перший слайд
      this.setSlide(this.current);
  
      // Якщо увімкнено автопрокрутку
      if (this.autoplay) {
        this.startAutoplay();
  
        // Зупиняємо autoplay при наведенні курсора миші
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
      }
    }
  
    // Додаємо стрілки навігації
    addArrows() {
      const left = document.createElement('button');
      left.className = 'arrow left';
      left.innerHTML = '&#10094;'; // символ ←
      left.onclick = () => this.prev();
  
      const right = document.createElement('button');
      right.className = 'arrow right';
      right.innerHTML = '&#10095;'; // символ →
      right.onclick = () => this.next();
  
      this.container.appendChild(left);
      this.container.appendChild(right);
    }
  
    // Додаємо крапки-пагінацію
    addDots() {
      this.dotsContainer = document.createElement('div');
      this.dotsContainer.className = 'dots';
      this.dots = [];
  
      this.slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.onclick = () => this.setSlide(i);
        this.dotsContainer.appendChild(dot);
        this.dots.push(dot);
      });
  
      this.container.appendChild(this.dotsContainer);
    }
  
    // Додаємо підтримку клавіш клавіатури
    addKeyboardSupport() {
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') this.next();
        if (e.key === 'ArrowLeft') this.prev();
      });
    }
  
    // Перемикання на вказаний слайд
    setSlide(index) {
      // Зациклюємо індекси, щоб реалізувати "loop mode"
      this.current = (index + this.slides.length) % this.slides.length;
  
      // Обчислюємо зсув у відсотках і додаємо анімацію
      const offset = -this.current * 100;
      this.track.style.transitionDuration = `${this.duration}ms`;
      this.track.style.transform = `translateX(${offset}%)`;
  
      // Оновлюємо активну крапку
      if (this.dots) {
        this.dots.forEach(dot => dot.classList.remove('active'));
        this.dots[this.current].classList.add('active');
      }
    }
  
    // Перехід до наступного слайду
    next() {
      this.setSlide(this.current + 1);
    }
  
    // Перехід до попереднього слайду
    prev() {
      this.setSlide(this.current - 1);
    }
  
    // Запуск автопрокрутки
    startAutoplay() {
      this.timer = setInterval(() => this.next(), 3000);
    }
  
    // Зупинка автопрокрутки
    stopAutoplay() {
      clearInterval(this.timer);
    }
  }
  