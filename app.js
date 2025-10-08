// app.js (Versão Final e Definitiva)

window.addEventListener('load', function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(reg => console.log('SW registrado')).catch(err => console.error('Erro SW', err));
    }
    if (typeof firebase === 'undefined' || typeof firebase.firestore === 'undefined') {
        console.error("ERRO CRÍTICO: Firebase não carregou.");
        return;
    }
    const db = firebase.firestore();
    const header = document.querySelector('header');
    const productList = document.getElementById('product-list');
    const siteTitle = document.getElementById('site-title');
    const siteSlogan = document.getElementById('site-slogan');
    const pageTitle = document.querySelector('title');
    const settingsRef = db.collection('settings').doc('siteConfig');
    
    settingsRef.get().then(doc => {
        let settings = {};
        if (doc.exists) {
            settings = doc.data();
        }
        if (settings.headerBgImageUrl) {
            header.style.backgroundImage = `url('${settings.headerBgImageUrl}')`;
        }
        const whatsappNumber = settings.whatsappNumber || '5500000000000';
        siteTitle.textContent = settings.siteName || 'Sítio';
        siteSlogan.textContent = settings.siteSlogan || 'Produtos da nossa terra para sua casa.';
        pageTitle.textContent = settings.siteName || 'Sítio';

        db.collection('products').orderBy('name').onSnapshot(snapshot => {
            productList.innerHTML = ''; 
            if (snapshot.empty) {
                productList.innerHTML = "<p>Nenhum produto cadastrado no momento.</p>";
                return;
            }
            snapshot.forEach(productDoc => {
                const product = productDoc.data();
                const card = document.createElement('div');
                card.className = 'product-card';
                const message = encodeURIComponent(`Olá! Tenho interesse em comprar: ${product.name} (${product.price}).`);
                const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

                // ESTRUTURA HTML FINAL E CORRETA
                card.innerHTML = `
                    <div class="product-image-container">
                        <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="description">${product.description}</p>
                        <div class="price">${product.price}</div>
                    </div>
                    <a href="${whatsappLink}" class="buy-button" target="_blank">Comprar via WhatsApp</a>
                `;
                productList.appendChild(card);
            });
        }, error => {
            console.error("ERRO AO BUSCAR PRODUTOS:", error);
            productList.innerHTML = `<p style="color: red;">Erro ao carregar produtos.</p>`;
        });
    }).catch(error => {
        console.error("ERRO FATAL AO BUSCAR CONFIGURAÇÕES:", error);
        productList.innerHTML = `<p style="color: red;">Erro crítico ao carregar o site.</p>`;
    });
});
