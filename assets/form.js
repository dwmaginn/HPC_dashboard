document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    const message = document.getElementById('form-message');
    if (!form) return;

    form.addEventListener('submit', () => {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        if (message) message.textContent = 'Submitting...';
    });
});


