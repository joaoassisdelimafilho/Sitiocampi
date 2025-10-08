// app.js (Versão Final com verificação de inicialização)

// A função principal só será executada quando o Firebase estiver 100% carregado.
// Usamos onAuthStateChanged como um gatilho seguro para iniciar a lógica do app.
firebase.auth().onAuthStateChanged(() => {
    console.log("Firebase pronto. Iniciando a lógica principal do app.");

    // --- 1. REGISTRO DO SERVICE WORKER (PWA) ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('PWA: Service Worker registrado com sucesso.'))
            .catch(err => console.error('PWA: Falha ao registrar Service Worker:', err));
    }

    // --- 2. LÓGICA PRINCIPAL DA APLICAÇÃO ---
    if (typeof firebase.firestore === 'undefined') {
        console.error("ERRO CRÍTICO: Firestore não está disponível.");
        document.getElementById('product-list').innerHTML = `<p style="color: red;">Erro crítico: O banco de dados não pôde ser carregado.</p>`;
        return;
    }

    const db = firebase.firestore();

    // Elementos do DOM
    const productList = document.getElementById('product-list');
    const siteTitle = document.getElementById('site-title');
    const siteSlogan = document.getElementById('site-slogan');
    const pageTitle = document.querySelector('title');

    // Busca as configurações do site
    const settingsRef = db.collection('settings').doc('siteConfig');
    
    settingsRef.get().then(doc => {
        let settings = {};
        if (doc.exists) {
            settings = doc.data();
        } else {
            console.warn("AVISO: Documento de configurações não encontrado! Usando valores padrão.");
        }

        const whatsappNumber = settings.whatsappNumber || '5500000000000';
        siteTitle.textContent = settings.siteName || 'Sítio';
        siteSlogan.textContent = settings.siteSlogan || 'Produtos frescos da roça, direto para sua mesa!';
        pageTitle.textContent = settings.siteName || 'Sítio';

        // Busca os produtos
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

                card.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
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
            // Este erro agora deve ser mais específico se acontecer
            productList.innerHTML = `<p style="color: red;">Erro ao carregar produtos. Verifique o console para detalhes (F12).</p>`;
        });

    }).catch(error => {
        console.error("ERRO FATAL AO BUSCAR CONFIGURAÇÕES:", error);
        productList.innerHTML = `<p style="color: red;">Erro crítico ao carregar o site. Verifique as regras do Firestore.</p>`;
    });
});
