document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('summary-items-container');
    const totalAmountElement = document.getElementById('summary-total-amount');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardIconContainer = document.getElementById('card-icon-container');
    
    // Function to load cart from sessionStorage and display it
    function displayOrderSummary() {
        const storedCart = sessionStorage.getItem('shoppingCart');
        const cart = storedCart ? JSON.parse(storedCart) : [];

        summaryContainer.innerHTML = '';

        if (cart.length === 0) {
            summaryContainer.innerHTML = '<p>Your cart is empty.</p>';
            totalAmountElement.textContent = '৳0';
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

    // --- Card Validation and Type Detection ---
    const luhnCheck = (val) => {
        let sum = 0;
        let numdigits = val.length;
        let parity = numdigits % 2;
        for (let i = 0; i < numdigits; i++) {
            let digit = parseInt(val.charAt(i));
            if (i % 2 === parity) digit *= 2;
            if (digit > 9) digit -= 9;
            sum += digit;
        }
        return (sum % 10) === 0;
    };

    function getCardType(number) {
        let re = new RegExp("^4");
        if (number.match(re) != null) return "visa";
        re = new RegExp("^5[1-5]");
        if (number.match(re) != null) return "mastercard";
        re = new RegExp("^3[47]");
        if (number.match(re) != null) return "amex";
        re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5])|64[4-9]|65)");
        if (number.match(re) != null) return "discover";
        return null;
    }

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', () => {
            let value = cardNumberInput.value.replace(/\D/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
            cardNumberInput.value = formattedValue;

            const cardNumber = value;
            const cardType = getCardType(cardNumber);

            cardIconContainer.innerHTML = '';
            if (cardType) {
                const icon = document.createElement('i');
                const typeMap = {
                    visa: 'fa-brands fa-cc-visa',
                    mastercard: 'fa-brands fa-cc-mastercard',
                    amex: 'fa-brands fa-cc-amex',
                    discover: 'fa-brands fa-cc-discover'
                };
                icon.className = `${typeMap[cardType]} visible`;
                cardIconContainer.appendChild(icon);
            }

            if (cardNumber.length >= 13 && cardNumber.length <= 19) {
                if (luhnCheck(cardNumber)) {
                    cardNumberInput.classList.remove('invalid');
                } else {
                    cardNumberInput.classList.add('invalid');
                }
            } else {
                cardNumberInput.classList.remove('invalid');
            }
        });
    }

    // --- Form Validation Logic ---
    function validateForm() {
        const requiredInputs = document.querySelectorAll('#shipping-form [required], #payment-form [required]');
        let isFormValid = true;

        requiredInputs.forEach(input => {
            input.style.borderColor = '#ccc';
            if (input.value.trim() === '') {
                isFormValid = false;
                input.style.borderColor = 'red';
            }
        });

        if (cardNumberInput && (cardNumberInput.classList.contains('invalid') || !luhnCheck(cardNumberInput.value.replace(/\s/g, '')))) {
            isFormValid = false;
            cardNumberInput.style.borderColor = 'red';
        }
        
        return isFormValid;
    }

    // Add event listener to the "Place Order" button
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', (event) => {
            event.preventDefault();

            if (validateForm()) {
                const userEmail = document.getElementById('email').value;
                const currentCart = sessionStorage.getItem('shoppingCart');

                sessionStorage.setItem('finalOrderCart', currentCart);
                sessionStorage.setItem('userEmail', userEmail);
                
                alert('Thank you! Your order has been placed successfully.');
                
                sessionStorage.removeItem('shoppingCart');
                
                window.location.href = 'confirmPurchase.html';
            } else {
                alert('Please fill out all required fields and provide a valid card number.');
            }
        });
    }

    // Run the order summary function when the page loads
    displayOrderSummary();
});