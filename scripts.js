/**
 * СВАЙБЕТОН — скрипты интерактивности
 * - Плавный скролл по якорям
 * - Подсветка активного пункта меню при скролле
 * - Бургер-меню (мобильное)
 * - Модальное окно (заказать звонок / рассчитать стоимость)
 * - Маска телефона +7 (XXX) XXX-XX-XX
 * - Анимация появления карточек при скролле
 * - Отправка форм в Telegram
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // КОНФИГУРАЦИЯ TELEGRAM
    // ============================================
    const BOT_TOKEN = '8935859913:AAELBngmSmra05AddqPHf-C8bX5dWqKWWiM';
    const CHAT_ID = '1959502543';

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
            let value = e.target.value.replace(/\D/g, '');

            if (value.startsWith('8')) {
                value = '7' + value.slice(1);
            }
            if (value.length > 0 && !value.startsWith('7')) {
                value = '7' + value;
            }
            if (value.length > 11) {
                value = value.slice(0, 11);
            }

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

        input.addEventListener('focus', function (e) {
            if (!e.target.value) {
                e.target.value = '+7';
            }
        });

        input.addEventListener('blur', function (e) {
            if (e.target.value === '+7' || e.target.value === '+7 (') {
                e.target.value = '';
            }
        });
    }

    allPhoneInputs.forEach(input => phoneMask(input));

    // ============================================
    // ФУНКЦИЯ ОТПРАВКИ В TELEGRAM
    // ============================================
    async function sendToTelegram(name, phone, message = 'не указано') {
        const text = `📩 <b>Новая заявка с сайта</b>\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}\n💬 Сообщение: ${message || 'не указано'}\n\n🌐 Отправлено: ${new Date().toLocaleString('ru-RU')}`;

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });

        return response.ok;
    }

    // ============================================
    // БУРГЕР-МЕНЮ
    // ============================================
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll', mobileMenu.classList.contains('open'));
    });

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
            if (targetId === '#') return;

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
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
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
    setActiveNav();

    // ============================================
    // МОДАЛЬНОЕ ОКНО
    // ============================================
    function openModal(title) {
        modalTitle.textContent = title;
        modal.classList.add('open');
        document.body.classList.add('no-scroll');
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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // ============================================
    // ОТПРАВКА МОДАЛЬНОЙ ФОРМЫ В TELEGRAM
    // ============================================
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = modalName.value.trim();
        const phone = modalPhone.value.trim();

        if (!name || phone.replace(/\D/g, '').length < 11) {
            alert('⚠️ Пожалуйста, заполните все поля корректно.');
            return;
        }

        try {
            const success = await sendToTelegram(name, phone);

            if (success) {
                alert('✅ Спасибо! Мы перезвоним вам в ближайшее время.');
                closeModal();
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            alert('❌ Произошла ошибка. Попробуйте позже или позвоните по телефону.');
            console.error('Error:', error);
        }
    });

    // ============================================
    // ОТПРАВКА КОНТАКТНОЙ ФОРМЫ В TELEGRAM
    // ============================================
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const phone = contactPhone.value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        const lastSubmit = localStorage.getItem('lastFormSubmit');
        if (lastSubmit && Date.now() - lastSubmit < 60000) {
            alert('⏳ Пожалуйста, подождите 1 минуту перед повторной отправкой');
            return;
        }

        if (!name || phone.replace(/\D/g, '').length < 11) {
            alert('⚠️ Пожалуйста, заполните имя и телефон корректно.');
            return;
        }

        try {
            const success = await sendToTelegram(name, phone, message);

            if (success) {
                localStorage.setItem('lastFormSubmit', Date.now());
                alert('✅ Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                contactForm.reset();
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            alert('❌ Произошла ошибка. Попробуйте позже или позвоните по телефону.');
            console.error('Error:', error);
        }
    });

    // ============================================
    // АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
    // ============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================
    // БЛОКИРОВКА СКРОЛЛА
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        body.no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

});