document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('product-list');
    if (!list) return;

    const detailsEl = document.getElementById('details');
    const orderSelections = new Map();

    function parseMoneyLike(value) {
        if (value == null || value === '') return null;
        if (typeof value === 'number') return Number.isFinite(value) ? value : null;
        const stripped = String(value).replace(/[^0-9.\-]/g, '');
        const num = Number(stripped);
        return Number.isFinite(num) ? num : null;
    }

    function formatMoney(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) return '';
        return `$${number.toFixed(2)}`;
    }

    function findCasePrice(item) {
        const explicit = item['Case Price'] ?? item['CasePrice'] ?? item['casePrice'] ?? item['case_price'] ?? null;
        if (explicit != null && explicit !== '') return explicit;
        for (const key of Object.keys(item)) {
            const lower = key.toLowerCase();
            if (lower.includes('case') && lower.includes('price')) {
                const val = item[key];
                if (val != null && val !== '') return val;
            }
        }
        return null;
    }

    function updateDetailsTextarea() {
        if (!detailsEl) return;
        const lines = [];
        let orderTotal = 0;
        for (const { item, qty } of orderSelections.values()) {
            if (!qty || qty <= 0) continue;
            const name = item.Product || item.Name || item.name || 'Item';
            const unitPrice = parseMoneyLike(item.Price != null ? item.Price : (item.price != null ? item.price : null));
            const lineTotal = Number.isFinite(unitPrice) ? unitPrice * qty : 0;
            if (Number.isFinite(lineTotal)) orderTotal += lineTotal;
            const priceText = Number.isFinite(unitPrice) ? `${formatMoney(unitPrice)}` : 'N/A';
            const totalText = Number.isFinite(lineTotal) ? `${formatMoney(lineTotal)}` : '';
            lines.push(`${name} x ${qty} @ ${priceText}${totalText ? ` = ${totalText}` : ''}`);
        }
        if (lines.length === 0) {
            return;
        }
        const footer = Number.isFinite(orderTotal) && orderTotal > 0 ? `\nTotal: ${formatMoney(orderTotal)}` : '';
        detailsEl.value = `${lines.join('\n')}${footer}`.trim();
    }

    function createQuantityControls(itemId, item) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mt-3 flex items-center gap-2';

        const decBtn = document.createElement('button');
        decBtn.type = 'button';
        decBtn.className = 'px-2 py-1 border rounded text-gray-700 hover:bg-gray-50';
        decBtn.setAttribute('aria-label', 'Decrease quantity');
        decBtn.textContent = '-';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = '0';
        input.className = 'w-16 border rounded px-2 py-1 text-center';

        const incBtn = document.createElement('button');
        incBtn.type = 'button';
        incBtn.className = 'px-2 py-1 border rounded text-gray-700 hover:bg-gray-50';
        incBtn.setAttribute('aria-label', 'Increase quantity');
        incBtn.textContent = '+';

        function setQty(nextVal) {
            const qty = Math.max(0, Number.isFinite(nextVal) ? nextVal : 0);
            input.value = String(qty);
            orderSelections.set(itemId, { item, qty });
            updateDetailsTextarea();
        }

        decBtn.addEventListener('click', () => setQty(Number(input.value) - 1));
        incBtn.addEventListener('click', () => setQty(Number(input.value) + 1));
        input.addEventListener('input', () => setQty(Number(input.value)));

        wrapper.appendChild(decBtn);
        wrapper.appendChild(input);
        wrapper.appendChild(incBtn);
        return wrapper;
    }

    try {
        const res = await fetch('data/menu.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load menu');
        const items = await res.json();
        if (!Array.isArray(items)) throw new Error('Invalid menu format');
        list.innerHTML = '';
        let itemIndex = 0;
        for (const item of items) {
            const name = item.Product || item.Name || item.name || 'Item';
            const description = item.Description || item.description || '';
            const priceValue = item.Price != null ? item.Price : (item.price != null ? item.price : null);
            const category = item.Category || item.category || '';
            const casePriceValue = findCasePrice(item);
            const price = priceValue != null && priceValue !== '' ? formatMoney(priceValue) : '';
            const casePrice = casePriceValue != null && casePriceValue !== '' ? formatMoney(casePriceValue) : '';

            const card = document.createElement('article');
            card.className = 'border rounded-lg bg-white shadow p-4 flex flex-col';
            const priceBlock = `
                ${price ? `<div class="mt-3 text-right font-semibold text-green-700">${price}</div>` : ''}
                ${casePrice ? `<div class="mt-1 text-right text-sm text-gray-600">Case: ${casePrice}</div>` : ''}
            `;
            card.innerHTML = `
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-800">${name}</h3>
                    ${category ? `<p class=\"text-xs text-gray-500 mt-0.5\">${category}</p>` : ''}
                    ${description ? `<p class=\"text-sm text-gray-700 mt-2\">${description}</p>` : ''}
                </div>
                ${priceBlock}
            `;

            const controls = createQuantityControls(itemIndex, item);
            card.appendChild(controls);

            list.appendChild(card);
            itemIndex += 1;
        }
    } catch (_err) {
        list.innerHTML = '<div class="text-sm text-red-600">Menu is unavailable right now.</div>';
    }
});


