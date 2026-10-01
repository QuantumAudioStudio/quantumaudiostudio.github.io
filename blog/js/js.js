window.addEventListener('scroll', function() {
    const progressBar = document.getElementById("myBar");

    if (progressBar) {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + "%";
    }
});

    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-links');

    menu.addEventListener('click', function() {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        menu.classList.remove('is-active');
        menuLinks.classList.remove('active');
    }));

    
    document.addEventListener("DOMContentLoaded", () => {
    const relatedSection = document.querySelector(".related-posts-container");
    const relatedContainer = document.getElementById("related-posts-grid");

    if (!relatedContainer || !relatedSection) return;

    // Obtener la categoría del post actual desde el atributo HTML
    const categoriaActual = relatedSection.getAttribute("data-categoria") || "";

    // Petición al JSON en el servidor
    fetch("/blog/articulos.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then((articulos) => {
            relatedContainer.innerHTML = "";

            const currentPath = window.location.pathname;

            // 1. Filtrar para eliminar el artículo actual donde estamos parados
            const todosMenosActual = articulos.filter(art => !currentPath.includes(art.slug));

            // 2. Filtrar los que pertenecen a la misma categoría
            let seleccionados = todosMenosActual.filter(art => 
                categoriaActual && art.categoria.toLowerCase() === categoriaActual.toLowerCase()
            );

            // 3. Si hay menos de 3 artículos de la misma categoría, rellenar con los más recientes
            if (seleccionados.length < 3) {
                const faltantes = 3 - seleccionados.length;
                
                // Obtener artículos que no estén ya en "seleccionados"
                const relleno = todosMenosActual.filter(art => !seleccionados.includes(art));
                
                // Unir selección actual con los que faltan
                seleccionados = seleccionados.concat(relleno.slice(0, faltantes));
            } else {
                // Si hay más de 3, tomar solo los primeros 3
                seleccionados = seleccionados.slice(0, 3);
            }

            // 4. Renderizar tarjetas en el HTML respetando tu estructura exacta
            seleccionados.forEach((art) => {
                const card = document.createElement("div");
                card.className = "related-card";

                card.innerHTML = `
                    <a href="/blog/${art.slug}" class="related-img-link">
                        <img src="${art.imagen}" alt="${art.alt || art.titulo}" class="related-img" loading="lazy">
                    </a>
                    <div class="related-content">
                        <span class="related-badge">${art.categoria}</span>
                        <h3 class="related-card-title">
                            <a href="/blog/${art.slug}">${art.titulo}</a>
                        </h3>
                        <p class="related-excerpt">${art.descripcion}</p>
                    </div>
                `;

                relatedContainer.appendChild(card);
            });
        })
        .catch((err) => {
            console.error("Error al cargar los artículos relacionados:", err);
            relatedContainer.innerHTML = `<p style="color: #666; font-size: 14px; text-align: center;">No se pudieron cargar recomendaciones en este momento.</p>`;
        });
});