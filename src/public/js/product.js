function changeImage(newImageUrl) {
        document.getElementById('main-product-image').src = newImageUrl;
    };

    document.addEventListener('DOMContentLoaded', () => {
    const addToCartForm = document.getElementById('add-to-cart-form');

    if (addToCartForm) {
        addToCartForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(addToCartForm);
            const productId = formData.get('productId');
            const quantity = formData.get('quantity');
            const button = addToCartForm.querySelector('button[type="submit"]');
            const originalButtonText = button.innerHTML;

            button.disabled = true;
            button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Adicionando...';

            try {
                const response = await fetch('/buyer/cart/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId, quantity })
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        window.location.href = '/auth/login';
                        return;
                    }
                    throw new Error('Falha ao adicionar ao carrinho');
                }

                const data = await response.json();

                button.innerHTML = '<i class="fa-solid fa-check"></i> Adicionado!';

            } catch (error) {
                console.error('Erro:', error);
                button.innerHTML = 'Erro! Tente novamente.';
            } finally {
                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = originalButtonText;
                }, 2000);
            }
        });
    }
});