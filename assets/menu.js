document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('product-list');
    if (!list) return;
    try {
        const res = await fetch('data/menu.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load menu');
        const items = await res.json();
        if (!Array.isArray(items)) throw new Error('Invalid menu format');
        list.innerHTML = '';
        for (const item of items) {
            const div = document.createElement('div');
            div.className = 'product-item';
            div.innerHTML = `
                <h3>${item.Product || item.name || 'Item'}</h3>
                <p>${item.Description || item.description || ''}</p>
                <p>${item.Price != null ? `$${item.Price}` : (item.price != null ? `$${item.price}` : '')}</p>
            `;
            list.appendChild(div);
        }
    } catch (err) {
        list.textContent = 'Menu is unavailable right now.';
        // Optionally log to console for debugging during dev
        // console.error(err);
    }
});


