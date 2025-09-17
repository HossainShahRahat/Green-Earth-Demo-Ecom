document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('summary-items-container');
    const totalAmountElement = document.getElementById('summary-total-amount');
    const userEmailElement = document.getElementById('user-email');

    // Load final cart and user email from sessionStorage
    const finalCart = JSON.parse(sessionStorage.getItem('finalOrderCart')) || [];
    const userEmail = sessionStorage.getItem('userEmail') || 'your.email@example.com';

    // Display the user's email
    userEmailElement.textContent = userEmail;

    // Clear any placeholder content
    summaryContainer.innerHTML = '';
    
    if (finalCart.length === 0) {
        summaryContainer.innerHTML = '<p>No order details found.</p>';
        totalAmountElement.textContent = '৳0';
        return;
    }

    let total = 0;
    finalCart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('summary-item');
        
        itemDiv.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>৳${item.price * item.quantity}</span>
        `;
        
        summaryContainer.appendChild(itemDiv);
        total += item.price * item.quantity;
    });

    // Update the total amount
    totalAmountElement.textContent = `৳${total}`;

    // Clear the session storage so the order isn't shown again on refresh
    sessionStorage.removeItem('finalOrderCart');
    sessionStorage.removeItem('userEmail');
});