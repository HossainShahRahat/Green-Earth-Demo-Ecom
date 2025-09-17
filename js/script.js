document.addEventListener('DOMContentLoaded', () => {
    // --- API URLs ---
    const all_plants_URL = "https://openapi.programming-hero.com/api/plants";
    const all_categories_URL = "https://openapi.programming-hero.com/api/categories";
    const plants_by_categories_URL = "https://openapi.programming-hero.com/api/category/${id}";
    const plants_detail_URL = "https://openapi.programming-hero.com/api/plant/${id}";

    // --- DOM ELEMENT SELECTORS ---
    const productList = document.getElementById("card-container");
    const categoryList = document.getElementById("category-list");
    const allTree = document.getElementById("all-tree");
    const navCart = document.getElementById("nav-cart");
    const cartCountBadge = document.getElementById("cart-count-badge");
    const plantModal = document.getElementById("plant-modal");
    const plantModalBody = document.getElementById("modal-body");
    const closePlantModalBtn = document.querySelector("#plant-modal .close-button");
    const cartModal = document.getElementById("cart-modal");
    const cartModalBody = document.getElementById("cart-modal-body");
    const cartModalTotal = document.getElementById("cart-modal-total");
    const closeCartModalBtn = document.getElementById("close-cart-button");
    const cartModalFooter = document.querySelector(".cart-modal-footer");
    const counters = document.querySelectorAll('.counter');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('close-btn');
    const sidebarCartBtn = document.getElementById('sidebar-cart-btn');

    // Toast Notification Element
    const toastNotification = document.createElement("div");
    toastNotification.classList.add("toast-notification");
    document.body.appendChild(toastNotification);

    let cart = [];
    let currentPlants = [];

    // --- NEW: Helper functions for opening and closing modals ---
    function openModal(modal) {
        if (!modal) return;
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    // --- Functions to manage cart data in sessionStorage ---
    function saveCartToSession() {
        sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function loadCartFromSession() {
        const storedCart = sessionStorage.getItem('shoppingCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    }

    // --- INITIALIZATION ---
    loadCartFromSession();
    loadPlants();
    loadAndDisplayCategories();
    updateCartDisplay();


    // --- EVENT LISTENERS ---
    allTree.addEventListener("click", () => {
        handleCategorySelection(allTree);
        loadPlants();
    });

    productList.addEventListener("click", (event) => {
        const target = event.target;
        const card = target.closest('.card');
        if (!card) return;
        
        const plantId = card.dataset.plantId;

        if (target.classList.contains("add-to-cart-btn")) {
            addToCart(plantId);
        } else {
            loadPlantDetails(plantId);
        }
    });

    cartModalBody.addEventListener('click', (event) => {
        const target = event.target;
        const plantId = target.closest('.dynamic-cart-item')?.dataset.plantId;

        if (!plantId) return;

        if (target.classList.contains('increase-qty')) {
            changeQuantity(plantId, 1);
        } else if (target.classList.contains('decrease-qty')) {
            changeQuantity(plantId, -1);
        } else if (target.classList.contains('remove-btn')) {
            removeFromCart(plantId);
        }
    });
    
    // NEW: Listener for the "Add to Cart" button inside the plant details modal
    plantModalBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-modal-btn')) {
            const plantId = event.target.dataset.plantId;
            addToCart(plantId);
            closeModal(plantModal); // Use the new close function
        }
    });

    // UPDATED: Modal event listeners now use helper functions
    navCart.addEventListener("click", () => openModal(cartModal));
    closeCartModalBtn.addEventListener("click", () => closeModal(cartModal));
    closePlantModalBtn.addEventListener("click", () => closeModal(plantModal));

    window.addEventListener("click", (event) => {
        if (event.target === plantModal) closeModal(plantModal);
        if (event.target === cartModal) closeModal(cartModal);
    });

    // --- Sidebar Navigation Event Listeners ---
    const openSidebar = () => sidebar.classList.add('open');
    const closeSidebar = () => sidebar.classList.remove('open');

    if (hamburgerMenu) hamburgerMenu.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (sidebarCartBtn) {
        sidebarCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeSidebar();
            setTimeout(() => { openModal(cartModal); }, 300); // UPDATED
        });
    }
    document.addEventListener('click', (event) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            closeSidebar();
        }
    });
    sidebar.querySelectorAll('a').forEach(link => {
        if (link.id !== 'sidebar-cart-btn') {
            link.addEventListener('click', closeSidebar);
        }
    });


    // --- DATA FETCHING & DISPLAY ---
    function showLoader() {
        let skeletons = '';
        for (let i = 0; i < 8; i++) {
            skeletons += `
                <div class="skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-footer">
                        <div class="skeleton-tag"></div>
                        <div class="skeleton-price"></div>
                    </div>
                    <div class="skeleton-button"></div>
                </div>
            `;
        }
        productList.innerHTML = skeletons;
    }

    function loadAndDisplayCategories() {
        fetch(all_categories_URL)
            .then(res => res.json())
            .then(data => {
                if (data && data.categories) {
                    data.categories.forEach(category => {
                        const li = document.createElement("li");
                        li.textContent = category.category_name;
                        li.addEventListener("click", () => {
                            handleCategorySelection(li);
                            loadSelectivePlants(category.id);
                        });
                        categoryList.appendChild(li);
                    });
                }
            })
            .catch(error => console.error("Error fetching categories:", error));
    }

    function loadPlants() {
        handleCategorySelection(allTree);
        showLoader();
        fetch(all_plants_URL)
            .then(res => res.json())
            .then(data => {
                if (data && data.plants) {
                    displayPlants(data.plants);
                }
            })
            .catch(error => {
                console.error("Error fetching all plants:", error);
                productList.innerHTML = "<p>Failed to load plants.</p>";
            });
    }

    function loadSelectivePlants(id) {
        showLoader();
        fetch(plants_by_categories_URL.replace("${id}", id))
            .then(res => res.json())
            .then(data => {
                if (data && data.plants) {
                    displayPlants(data.plants);
                }
            })
            .catch(error => {
                console.error(`Error fetching plants for category ${id}:`, error);
                productList.innerHTML = "<p>Failed to load plants.</p>";
            });
    }

    function displayPlants(plants) {
        currentPlants = plants;
        productList.innerHTML = "";
        plants.forEach(plant => {
            const card = createPlantCard(plant);
            productList.appendChild(card);
        });
    }

    function loadPlantDetails(id) {
        if (!id) return;
        fetch(plants_detail_URL.replace("${id}", id))
            .then(res => res.json())
            .then(data => {
                if (data && data.plants) {
                    displayPlantModal(data.plants);
                }
            })
            .catch(error => console.error(`Error fetching details for plant ${id}:`, error));
    }


    // --- UI & MODAL RENDERING ---
    function createPlantCard(plant) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.dataset.plantId = plant.id;

        cardDiv.innerHTML = `
            <div class="image-container">
                <img src="${plant.image}" alt="${plant.name}">
            </div>
            <h3>${plant.name}</h3>
            <p>${plant.description.substring(0, 80)}...</p>
            <div class="card-footer">
                <span class="category-tag">${plant.category}</span>
                <span class="price">৳${plant.price}</span>
            </div>
            <button class="add-btn add-to-cart-btn">Add to Cart</button>
        `;
        return cardDiv;
    }

    // UPDATED: Now includes an "Add to Cart" button
    function displayPlantModal(plant) {
        plantModalBody.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}">
            <h2>${plant.name}</h2>
            <p>${plant.description}</p>
            <p><strong>Category:</strong> ${plant.category}</p>
            <div class="price">Price: ৳${plant.price}</div>
            <button class="add-btn add-to-cart-modal-btn" data-plant-id="${plant.id}" style="margin-top: 1rem;">Add to Cart</button>
        `;
        openModal(plantModal);
    };

    function handleCategorySelection(selectedLi) {
        categoryList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
        selectedLi.classList.add('selected');
    }

    function showToast(message, duration = 2500) {
        toastNotification.textContent = message;
        toastNotification.classList.add('show');
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, duration);
    }


    // --- CART LOGIC & MANAGEMENT ---
    function addToCart(plantId) {
        const plantToAdd = currentPlants.find(plant => plant.id == plantId);
        if (!plantToAdd) return;

        const existingItem = cart.find(item => item.id == plantId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...plantToAdd, quantity: 1 });
        }
        saveCartToSession();
        updateCartDisplay();
        showToast(`Added "${plantToAdd.name}" to cart!`);
    }

    function removeFromCart(plantId) {
        const itemToRemove = cart.find(item => item.id == plantId);
        if (itemToRemove) {
            const userConfirmed = confirm(`Are you sure you want to remove "${itemToRemove.name}" from your cart?`);
            
            if (userConfirmed) {
                cart = cart.filter(item => item.id != plantId);
                saveCartToSession();
                updateCartDisplay();
                showToast(`Removed "${itemToRemove.name}" from cart.`);
            }
        }
    }

    function changeQuantity(plantId, amount) {
        const cartItem = cart.find(item => item.id == plantId);
        if (cartItem) {
            cartItem.quantity += amount;
            if (cartItem.quantity <= 0) {
                removeFromCart(plantId);
            } else {
                saveCartToSession();
                updateCartDisplay();
            }
        }
    }

    function updateCartDisplay() {
        let total = 0;
        let totalQuantity = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            totalQuantity += item.quantity;
        });

        if (totalQuantity === 0) {
            cartModalBody.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some trees to get started!</p>
                </div>
            `;
            cartModalFooter.style.display = 'none';
        } else {
            cartModalBody.innerHTML = "";
            cart.forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "dynamic-cart-item";
                itemDiv.dataset.plantId = item.id;
                itemDiv.innerHTML = `
                    <div class="cart-item-image"><img src="${item.image}" alt="${item.name}"></div>
                    <div class="cart-item-info">
                        <p class="item-name">${item.name}</p>
                        <p class="item-price">৳${item.price} each</p>
                    </div>
                    <div class="quantity-adjuster">
                        <button class="quantity-btn decrease-qty">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-qty">+</button>
                    </div>
                    <button class="remove-btn">Remove</button>
                `;
                cartModalBody.appendChild(itemDiv);
            });
            cartModalFooter.style.display = 'block';
        }

        cartModalTotal.textContent = `৳${total}`;

        if (totalQuantity > 0) {
            cartCountBadge.textContent = totalQuantity;
            cartCountBadge.classList.remove("hidden");
        } else {
            cartCountBadge.classList.add("hidden");
        }
    }

    // --- COUNTING ANIMATION ---
    const speed = 200;

    const animateCount = (counter) => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        let currentCount = 0;

        const updateCount = () => {
            currentCount += increment;
            if (currentCount < target) {
                counter.innerText = Math.ceil(currentCount).toLocaleString();
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target.toLocaleString() + '+';
                if(target === 500000) {
                    counter.innerText = (target / 1000).toLocaleString() + 'K+';
                }
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
});