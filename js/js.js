
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


function showPayments() {
    // Oculta el botón principal
    document.getElementById('main-cta').style.display = 'none';
    // Muestra las opciones de pago
    document.getElementById('payment-options').style.display = 'block';
    
    // Si necesitas que la página haga un pequeño ajuste de scroll para centrar
    
}

// --- TEMPORIZADOR ---
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        display.textContent = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        if (--timer < 0) { clearInterval(countdown); }
    }, 1000);
}

function abrirCheckoutFinal() {
    // 1. Mostramos el modal
    document.getElementById('modalCheckout').style.display = 'flex';
    
    // 2. BLOQUEAMOS el scroll de la página de fondo
    document.body.style.overflow = 'hidden';

    // Lógica del temporizador (la que ya tenías)
    var fiveMinutes = 60 * 5, display = document.querySelector('#timer');
    if(display.textContent === "05:00") { startTimer(fiveMinutes, display); }

    // Render PayPal
    if (document.getElementById('paypal-button-modal-container').innerHTML === "") {
        renderPayPalModal();
    }
}

function cerrarCheckoutFinal() {
    // 1. Ocultamos el modal
    document.getElementById('modalCheckout').style.display = 'none';
    
    // 2. LIBERAMOS el scroll de la página de fondo
    document.body.style.overflow = 'auto';
}

function renderPayPalModal() {
    paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'buynow', height: 50 },
        createOrder: function(data, actions) {
            fbq('track', 'InitiateCheckout', { value: 497, currency: 'MXN' });
            gtag('event', 'click_paypal', { 'metodo': 'paypal' }); 
            return actions.order.create({
                purchase_units: [{
                    description: "Audio Cuántico 369",
                    amount: { currency_code: "MXN", value: "497.00" }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(orderData) {
                fbq('track', 'Purchase', { value: 497.00, currency: 'MXN' });
                gtag('event', 'purchase', { value: 497.00, currency: 'MXN', transaction_id: orderData.id });
                document.getElementById('payment-options-modal').innerHTML = `
                    <div style="padding: 30px; background: #1a1a1a; border-radius: 20px; border: 1px solid #d4af37; text-align: center;">
    <p style="color: #d4af37; font-weight: 700; font-size: 1.2rem; margin-bottom: 10px;">¡Pago Verificado Exitosamente!</p>
    <p style="color: #ffffff; margin-bottom: 20px; font-size: 0.9rem;">Tu acceso al portal cuántico ha sido habilitado.</p>
    
    <a href="https://quantumaudiostudio.github.io/vortex-369-authsys-data-authbienvenido-al-despertarcloud-storage-final/" 
       style="display:inline-block; background: linear-gradient(45deg, #d4af37, #f4d03f); color: black; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
        Acceder al Portal de Descarga
    </a>

    <!--div style="margin-top: 20px; padding: 10px; background: rgba(212, 175, 55, 0.1); border-radius: 8px;">
        <p style="color: #b0b0b0; font-size: 0.8rem; margin: 0;">Tu Clave de Acceso es:</p>
        <p style="color: #d4af37; font-weight: 700; font-size: 1.1rem; margin: 5px 0 0;">TESLA369</p>
    </div-->
</div>`;
            });
        }
    }).render('#paypal-button-modal-container');
}

        // 1. Lógica del FAQ
        document.querySelectorAll('.faq-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });

        // 2. Lógica del Contador (15 min)
        function startTimer(duration, display) {
            var timer = duration, minutes, seconds;
            setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);
                display.textContent = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
                if (--timer < 0) timer = duration;
            }, 1000);
        }

        // 3. Inicialización General
        window.addEventListener('load', function () {
            startTimer(60 * 15, document.querySelector('#countdown'));

            // Usuarios en vivo
            setInterval(() => {
                const viewing = Math.floor(Math.random() * (25 - 12 + 1)) + 12;
                document.getElementById('user-viewing').textContent = viewing + " personas";
            }, 4000);

            // Cupos bajando
            let currentStock = 9;
            const stockInterval = setInterval(() => {
                if (currentStock > 3) {
                    currentStock--;
                    document.getElementById('stock-count').textContent = currentStock + "/50 CUPOS";
                    document.getElementById('stock-bar').style.width = (currentStock * 2) + "%";
                } else clearInterval(stockInterval);
            }, 15000);
        });
   