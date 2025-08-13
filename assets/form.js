'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const message = document.getElementById('form-message');

    form.addEventListener('submit', (e) => {
        // Basic honeypot check
        const honeypot = form.querySelector('input[name="company"]');
        if (honeypot && honeypot.value) {
            e.preventDefault();
            if (message) message.textContent = 'Submission blocked.';
            return;
        }

        // Basic client-side validation
        if (!form.reportValidity()) {
            e.preventDefault();
            return;
        }

        // Prevent double submits and show status
        if (submitButton) submitButton.disabled = true;
        if (message) message.textContent = 'Submitting...';
    });
});


