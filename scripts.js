/**
 * СВАЙБЕТОН — скрипты интерактивности
 * - Плавный скролл по якорям
 * - Подсветка активного пункта меню при скролле
 * - Бургер-меню (мобильное)
 * - Модальное окно (заказать звонок / рассчитать стоимость)
 * - Маска телефона +7 (XXX) XXX-XX-XX
 * - Анимация появления карточек при скролле
 * - Обработка форм (заглушка отправки)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // ЭЛЕМЕНТЫ
    // ============================================
    const header = document.getElementById('header');
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const sections = document.querySelectorAll('.section[id], .hero[id]');

    // Модальное окно
    const modal = document.getElementById('callbackModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalForm = document.getElementById('modalForm');
    const modalPhone = document.getElementById('modalPhone');
    const modalName = document.getElementById('modalName');

    // Кнопки открытия модалки
    const openCallbackBtn = document.getElementById('openCallbackModal');
    const openCalcBtn = document.getElementById('openCalcModal');

    // Форма обратной связи
    const contactForm = document.getElementById('contactForm');
    const contactPhone = document.getElementById('contactPhone');

    // Все поля с телефоном на странице
    const allPhoneInputs = [modalPhone, contactPhone];

    // ============================================
    // МАСКА ТЕЛЕФОНА +7 (XXX) XXX-XX-XX
    // ============================================
    function phoneMask(input) {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); // Убираем все нецифровые символки

            // Если начинается с 8, заменяем на 7
            if (value.startsWith('8')) {
                value = '7' + value.slice(1);
            }
            // Если не начинается с 7, добавляем 7
            if (value.length > 0 && !value.startsWith('7')) {
                value = '7' + value;
            }
            // Ограничиваем 11 цифрами
            if (value.length > 11) {
                value = value.slice(0, 11);
            }

            // Формируем форматированную строку
            let formatted = '';
            if (value.length > 0) {
                formatted = '+7';
            }
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length > 4) {
                formatted += ') ' + value.slice(4, 7);
            }
            if (value.length > 7) {
                formatted += '-' + value.slice(7, 9);
            }
            if (value.length > 9) {
                formatted += '-' + value.slice(9, 11);
            }

            e.target.value = formatted;
        });

        // При фокусе — подставляем +7 если пусто
        input.addEventListener('focus', function (e) {
            if (!e.target.value) {
                e.target.value = '+7';
            }
        });

        // При потере фокуса — убираем пустой +7
        input.addEventListener('blur', function (e) {
            if (e.target.value === '+7' || e.target.value === '+7 (') {
                e.target.value = '';
            }
        });
    }

    allPhoneInputs.forEach(input => phoneMask(input));

    // ============================================
    // БУРГЕР-МЕНЮ
    // ============================================
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll', mobileMenu.classList.contains('open'));
    });

    // Закрытие мобильного меню при клике на ссылку
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    });

    // ============================================
    // ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Пропускаем пустые якоря

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ПРИ СКРОЛЛЕ
    // ============================================
    function setActiveNav() {
        const scrollPos = window.scrollY + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Десктопная навигация
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                // Мобильная навигация
                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);
    setActiveNav(); // Инициализация

    // ============================================
    // МОДАЛЬНОЕ ОКНО
    // ============================================
    function openModal(title) {
        modalTitle.textContent = title;
        modal.classList.add('open');
        document.body.classList.add('no-scroll');
        // Очищаем форму
        modalName.value = '';
        modalPhone.value = '';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }

    openCallbackBtn.addEventListener('click', () => openModal('Заказать звонок'));
    openCalcBtn.addEventListener('click', () => openModal('Рассчитать стоимость'));
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // Отправка формы в модалке (заглушка)
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = modalName.value.trim();
        const phone = modalPhone.value.trim();

        if (!name || phone.replace(/\D/g, '').length < 11) {
            alert('Пожалуйста, заполните все поля корректно.');
            return;
        }

        // Здесь будет отправка на сервер
        alert(`Спасибо, ${name}! Мы перезвоним вам по номеру ${phone} в ближайшее время.`);
        closeModal();
    });

    // Отправка контактной формы (заглушка)
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('#contactName').value.trim();
        const phone = contactPhone.value.trim();
        const message = contactForm.querySelector('#contactMessage').value.trim();

        if (!name || phone.replace(/\D/g, '').length < 11) {
            alert('Пожалуйста, заполните имя и телефон корректно.');
            return;
        }

        // Здесь будет отправка на сервер
        alert(`Спасибо, ${name}! Ваше сообщение получено. Мы свяжемся с вами по номеру ${phone}.`);
        contactForm.reset();
    });

    // ============================================
    // АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ (Intersection Observer)
    // ============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observerInstance.unobserve(entry.target); // Анимация только один раз
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Фоллбэк для старых браузеров — показываем всё сразу
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================
    // БЛОКИРОВКА СКРОЛЛА ПРИ ОТКРЫТОЙ МОДАКЕ / МЕНЮ
    // ============================================
    // CSS-класс для body
    const style = document.createElement('style');
    style.textContent = `
        body.no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

});
