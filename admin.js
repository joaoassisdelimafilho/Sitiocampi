// admin.js (Ajustado para o novo layout da lista)

window.addEventListener('load', function() {
    // --- ELEMENTOS DO DOM ---
    const logoutButton = document.getElementById('logout-button');
    const settingsForm = document.getElementById('settings-form');
    const siteNameInput = document.getElementById('setting-site-name');
    const siteSloganInput = document.getElementById('setting-site-slogan');
    const whatsappInput = document.getElementById('setting-whatsapp');
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productDescInput = document.getElementById('product-description');
    const productPriceInput = document.getElementById('product-price');
    const productImageUrlInput = document.getElementById('product-image-url');
    const cancelEditButton = document.getElementById('cancel-edit');
    const adminProductList = document.getElementById('admin-product-list');

    // --- AUTENTICAÇÃO ---
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.replace('login.html');
        }
    });

    logoutButton.addEventListener('click', () => {
        auth.signOut();
    });

    // --- LÓGICA DE CONFIGURAÇÕES ---
    const settingsRef = db.collection('settings').doc('siteConfig');

    settingsRef.get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            siteNameInput.value = data.siteName || '';
            siteSloganInput.value = data.siteSlogan || '';
            whatsappInput.value = data.whatsappNumber || '';
        }
    });

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitButton = e.target.querySelector('button');
        submitButton.disabled = true;

        settingsRef.set({
            siteName: siteNameInput.value,
            siteSlogan: siteSloganInput.value,
            whatsappNumber: whatsappInput.value
        }, { merge: true })
        .then(() => {
            alert('Configurações salvas com sucesso!');
            submitButton.disabled = false;
        })
        .catch(error => {
            console.error("Erro ao salvar configurações: ", error);
            alert('Erro ao salvar configurações.');
            submitButton.disabled = false;
        });
    });

    // --- LÓGICA DE PRODUTOS ---
    const productsRef = db.collection('products');

    const resetProductForm = () => {
        productForm.reset();
        productIdInput.value = '';
        cancelEditButton.style.display = 'none';
    };

    cancelEditButton.addEventListener('click', resetProductForm);

    productsRef.orderBy('name').onSnapshot(snapshot => {
        adminProductList.innerHTML = '';
        snapshot.forEach(doc => {
            const product = doc.data();
            const item = document.createElement('div');
            item.className = 'product-item';

            // MUDANÇA AQUI: Nova estrutura HTML para funcionar com o Grid
            item.innerHTML = `
                <span class="product-text"><strong>${product.name}</strong> - ${product.price}</span>
                <div class="product-actions">
                    <button class="btn-edit" data-id="${doc.id}">Editar</button>
                    <button class="btn-delete" data-id="${doc.id}">Excluir</button>
                </div>
            `;
            adminProductList.appendChild(item);
        });
    });

    adminProductList.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('btn-edit')) {
            productsRef.doc(id).get().then(doc => {
                if (doc.exists) {
                    const product = doc.data();
                    productIdInput.value = doc.id;
                    productNameInput.value = product.name;
                    productDescInput.value = product.description;
                    productPriceInput.value = product.price;
                    productImageUrlInput.value = product.imageUrl;
                    cancelEditButton.style.display = 'inline-block';
                    window.scrollTo(0, 0);
                }
            });
        }

        if (target.classList.contains('btn-delete')) {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                productsRef.doc(id).delete();
            }
        }
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = productIdInput.value;
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        const productData = {
            name: productNameInput.value,
            description: productDescInput.value,
            price: productPriceInput.value,
            imageUrl: productImageUrlInput.value,
            createdAt: new Date()
        };

        const promise = id 
            ? productsRef.doc(id).update(productData)
            : productsRef.add(productData);

        promise.then(() => {
            alert(id ? 'Produto atualizado!' : 'Produto salvo!');
            resetProductForm();
        }).catch(error => {
            console.error("Erro ao salvar produto: ", error);
            alert("Erro ao salvar produto.");
        }).finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Salvar Produto';
        });
    });

    resetProductForm();
});
