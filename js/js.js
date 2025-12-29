    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('sliderDots');
    const cards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    // Generar puntos de navegación basados en el número de tarjetas
    function createDots() {
        const cardsVisible = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        const dotCount = cards.length - cardsVisible + 1;
        
        dotsContainer.innerHTML = '';
        if (dotCount <= 1) return;

        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        const cardWidth = cards[0].offsetWidth + 20; // Ancho + gap
        track.style.transform = `translateX(-${index * cardWidth}px)`;
        currentIndex = index;
        updateDots();
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Soporte para deslizar con el dedo (Touch)
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) nextSlide();
        if (endX - startX > 50) prevSlide();
    });

    function nextSlide() {
        const cardsVisible = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        if (currentIndex < cards.length - cardsVisible) {
            goToSlide(currentIndex + 1);
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }

    window.addEventListener('resize', createDots);
    createDots();

// --- LÓGICA DE PAGOS Y MODAL ---
function showPayments() {
    document.getElementById('main-cta').style.display = 'none';
    document.getElementById('payment-options').style.display = 'block';
}

function abrirCheckoutFinal() {
    document.getElementById('modalCheckout').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    var fiveMinutes = 60 * 5, display = document.querySelector('#timer');
    if(display && display.textContent === "05:00") { 
        startTimer(fiveMinutes, display); 
    }

    if (document.getElementById('paypal-button-modal-container').innerHTML === "") {
        renderPayPalModal();
    }
}

function cerrarCheckoutFinal() {
    document.getElementById('modalCheckout').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// --- TEMPORIZADOR GLOBAL ---
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        display.textContent = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        if (--timer < 0) { clearInterval(countdown); }
    }, 1000);
}

// --- PAYPAL MODAL ---
function renderPayPalModal() {
    paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'buynow', height: 50 },
        createOrder: function(data, actions) {
            if(typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout', { value: 497, currency: 'MXN' });
            if(typeof gtag !== 'undefined') gtag('event', 'click_paypal', { 'metodo': 'paypal' }); 
            return actions.order.create({
                purchase_units: [{
                    description: "Audio Cuántico 369",
                    amount: { currency_code: "MXN", value: "497.00" }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(orderData) {
                if(typeof fbq !== 'undefined') fbq('track', 'Purchase', { value: 497.00, currency: 'MXN' });
                if(typeof gtag !== 'undefined') gtag('event', 'purchase', { value: 497.00, currency: 'MXN', transaction_id: orderData.id });
                document.getElementById('payment-options-modal').innerHTML = `
                    <div style="padding: 30px; background: #1a1a1a; border-radius: 20px; border: 1px solid #d4af37; text-align: center;">
                        <p style="color: #d4af37; font-weight: 700; font-size: 1.2rem; margin-bottom: 10px;">¡Pago Exitoso!</p>
                        <a href="https://quantumaudiostudio.github.io/vortex-369-authsys-data-authbienvenido-al-despertarcloud-storage-final/" 
                           style="display:inline-block; background: gold; color: black; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: 700;">
                           ACCEDER AHORA
                        </a>
                    </div>`;
            });
        }
    }).render('#paypal-button-modal-container');
}

// --- FAQ ---
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

// --- INICIALIZACIÓN AL CARGAR ---
window.addEventListener('load', function () {
    // Timer principal de 15 min
    const mainTimerDisplay = document.querySelector('#countdown');
    if(mainTimerDisplay) startTimer(60 * 15, mainTimerDisplay);

    // Usuarios en vivo
    setInterval(() => {
        const userDisplay = document.getElementById('user-viewing');
        if(userDisplay) {
            const viewing = Math.floor(Math.random() * (25 - 12 + 1)) + 12;
            userDisplay.textContent = viewing + " personas";
        }
    }, 4000);

    // Cupos bajando
    let currentStock = 9;
    const stockCountEl = document.getElementById('stock-count');
    const stockBarEl = document.getElementById('stock-bar');
    
    if(stockCountEl && stockBarEl) {
        const stockInterval = setInterval(() => {
            if (currentStock > 3) {
                currentStock--;
                stockCountEl.textContent = currentStock + "/50 CUPOS";
                stockBarEl.style.width = (currentStock * 2) + "%";
            } else clearInterval(stockInterval);
        }, 15000);
    }
});