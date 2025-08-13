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
            const name = item.Product || item.Name || item.name || 'Item';
            const description = item.Description || item.description || '';
            const priceValue = item.Price != null ? item.Price : (item.price != null ? item.price : null);
            const category = item.Category || item.category || '';
            const price = priceValue != null && priceValue !== '' ? `$${Number(priceValue).toFixed(2)}` : '';

            const card = document.createElement('article');
            card.className = 'border rounded-lg bg-white shadow p-4 flex flex-col';
            card.innerHTML = `
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-800">${name}</h3>
                    ${category ? `<p class=\"text-xs text-gray-500 mt-0.5\">${category}</p>` : ''}
                    ${description ? `<p class=\"text-sm text-gray-700 mt-2\">${description}</p>` : ''}
                </div>
                ${price ? `<div class=\"mt-3 text-right font-semibold text-green-700\">${price}</div>` : ''}
            `;
            list.appendChild(card);
        }
    } catch (_err) {
        list.innerHTML = '<div class="text-sm text-red-600">Menu is unavailable right now.</div>';
    }
});


