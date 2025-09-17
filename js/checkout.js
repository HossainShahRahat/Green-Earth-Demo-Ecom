document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('summary-items-container');
    const totalAmountElement = document.getElementById('summary-total-amount');
    const placeOrderBtn = document.getElementById('place-order-btn');
    
    // Function to load cart from sessionStorage and display it
    function displayOrderSummary() {
        const storedCart = sessionStorage.getItem('shoppingCart');
        const cart = storedCart ? JSON.parse(storedCart) : [];

        summaryContainer.innerHTML = '';

        if (cart.length === 0) {
            summaryContainer.innerHTML = '<p>Your cart is empty.</p>';
            totalAmountElement.textContent = '৳0';
            // Disable the order button if the cart is empty
            if(placeOrderBtn) placeOrderBtn.disabled = true;
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('summary-item');
            
            itemDiv.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>৳${item.price * item.quantity}</span>
            `;
            
            summaryContainer.appendChild(itemDiv);
            total += item.price * item.quantity;
        });

        totalAmountElement.textContent = `৳${total}`;
    }

    // --- Form Validation Logic ---
    function validateForm() {
        // Select all inputs that have the 'required' attribute
        const requiredInputs = document.querySelectorAll('#shipping-form [required], #payment-form [required]');
        let isFormValid = true;

        requiredInputs.forEach(input => {
            // Remove previous error styling
            input.style.borderColor = '#ccc';

            if (input.value.trim() === '') {
                // If a field is empty, mark form as invalid and highlight the field
                isFormValid = false;
                input.style.borderColor = 'red';
            }
        });

        return isFormValid;
    }

    // Add event listener to the "Place Order" button
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the form from submitting by default

            if (validateForm()) {
                // Get user's email from the form
                const userEmail = document.getElementById('email').value;
                // Get the current cart from session
                const currentCart = sessionStorage.getItem('shoppingCart');

                // Save the final cart and email for the confirmation page
                sessionStorage.setItem('finalOrderCart', currentCart);
                sessionStorage.setItem('userEmail', userEmail);
                
                alert('Thank you! Your order has been placed successfully.');
                
                // Clear the main shopping cart
                sessionStorage.removeItem('shoppingCart');
                
                // Redirect to the confirmation page
                window.location.href = 'confirmPurchase.html';
            } else {
                // If the form is not valid, inform the user
                alert('Please fill out all required fields in the shipping and payment forms.');
            }
        });
    }

    // Run the order summary function when the page loads
    displayOrderSummary();
});