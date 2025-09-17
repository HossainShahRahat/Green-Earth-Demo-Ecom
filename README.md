# Green Earth E-Commerce Platform

Welcome to the Green Earth project, a modern, fully responsive e-commerce front-end for a fictional plant nursery. This project allows users to browse different types of trees, add them to a shopping cart, and proceed through a checkout and confirmation flow. It is built with vanilla HTML, CSS, and JavaScript, focusing on a clean user interface and a great mobile-first experience.

## ✨ Features

  - **Dynamic Product Loading**: All plant and category data is fetched dynamically from a public API.
  - **Product Filtering**: Users can filter the displayed trees by selecting a category.
  - **Skeleton Loading Screen**: A modern skeleton screen is shown while products are being fetched, providing a better user experience than a simple spinner.
  - **Responsive Design**: The entire application is fully responsive and optimized for a seamless experience on desktop, tablet, and mobile devices.
  - **Mobile Navigation**: Includes a touch-friendly, slide-in sidebar navigation for mobile users.
  - **Interactive Shopping Cart**: A modal-based shopping cart allows users to view, adjust quantities, and remove items.
  - **Session Persistence**: The shopping cart state is saved in `sessionStorage`, allowing data to persist between the main shop and checkout pages.
  - **Multi-Step Checkout Process**:
      - **Checkout Form**: A dedicated page for users to enter their shipping and payment information.
      - **Form Validation**: Client-side validation ensures all required fields are filled before an order can be placed.
      - **Confirmation Page**: A "Thank You" page that displays a summary of the final order.
  - **Custom Notifications**: Uses modern toast notifications instead of default browser alerts for adding items to the cart.
  - **Animated Counters**: The "Our Impact" section features numbers that animate on scroll, counting up to the target value.

## 🚀 Tech Stack

  - **HTML5**: For the core structure and content.
  - **CSS3**: For all styling, including Flexbox, CSS Grid, custom properties, and animations.
  - **JavaScript (ES6+)**: For all dynamic functionality, including API calls, DOM manipulation, and state management.

## 📁 Project Structure

The project is organized into the following directories and files:

```
/
|-- index.html              # Main landing and shopping page
|-- css/
|   |-- style.css           # Base styles (desktop-first) and modern UI components
|   |-- device_responsive.css # Media queries for tablet and mobile responsiveness
|   |-- checkout.css        # Styles specific to the checkout page
|   |-- confirmPurchase.css # Styles specific to the order confirmation page
|-- js/
|   |-- script.js           # Main script for index.html (API calls, cart logic, UI events)
|   |-- checkout.js         # Script for the checkout page (form validation, summary)
|   |-- confirmPurchase.js  # Script for the confirmation page (displaying final order)
|-- html/
|   |-- checkout.html       # The checkout and payment form page
|   |-- confirmPurchase.html # The final "thank you" and order summary page
|-- assets/
|   |-- (project images)    # Contains all static images like logos and banners
|-- README.md               # This documentation file
```

## ⚙️ Setup and Installation

To run this project locally, no special tools or builds are required.

1.  Clone the repository or download the source code to your local machine.
2.  Open the project folder in your code editor.
3.  Open the **`index.html`** file in your web browser. A live server extension (like Live Server for VS Code) is recommended for the best experience.

## 💡 How It Works

The project's interactivity is handled by three main JavaScript files:

1.  **`script.js`**: This is the engine for the main `index.html` page.

      - It fetches all plant and category data from the API on page load.
      - It handles all user interactions like filtering categories, opening the plant details modal, and adding items to the cart.
      - It manages the `cart` array and saves it to **`sessionStorage`** whenever it is modified. This is key to making the cart data available on other pages.

2.  **`checkout.js`**: This script runs exclusively on `checkout.html`.

      - It reads the cart data from `sessionStorage`.
      - It dynamically builds the "Order Summary" based on the items found in the session.
      - It adds an event listener to the "Place Order" button that performs form validation. On success, it saves the final order details and user email to the session and redirects to the confirmation page.

3.  **`confirmPurchase.js`**: This script runs on the final confirmation page.

      - It reads the final order details and user email from `sessionStorage`.
      - It dynamically populates the order summary and confirmation message.
      - It then clears the data from the session to ensure the order is not displayed again on a page refresh.
