# expressCart Architecture

This document outlines the architecture of the expressCart application, a Node.js-based e-commerce platform.

## Core Technologies

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **Templating**: Handlebars.js (via `express-handlebars`)
*   **Frontend**: HTML, CSS, JavaScript

## Project Structure

The project is organized into the following key directories:

*   `app.js`: The main entry point of the application.
*   `bin/`: Contains scripts for tasks like generating test data.
*   `config/`: Holds configuration files for the application, including settings for payment gateways.
*   `lib/`: Contains various modules for functionalities like payment processing, database interaction, and utility functions.
*   `locales/`: Stores language files for internationalization (i18n).
*   `public/`: Serves static assets such as images, stylesheets, and client-side JavaScript.
*   `routes/`: Defines the application's routes and their corresponding handlers.
*   `test/`: Contains the application's test suite.
*   `views/`: Holds the Handlebars templates for the user interface.

## Architectural Overview

The application follows a Model-View-Controller (MVC) like pattern:

*   **Model**: The data layer is managed through the `lib/db.js` file, which establishes a connection to the MongoDB database. The various schemas for the data are defined in the `lib/schemas` directory.
*   **View**: The views are rendered using `express-handlebars`. The templates are located in the `views/` directory and are organized into layouts, partials, and themes.
*   **Controller**: The route handlers in the `routes/` directory act as the controllers. They process incoming requests, interact with the database, and render the appropriate views.

## Key Components

### 1. Web Server (`app.js`)

The `app.js` file is the heart of the application. It is responsible for:

*   Initializing the Express.js server.
*   Configuring middleware for tasks like logging, parsing cookies, and managing sessions.
*   Setting up the Handlebars templating engine.
*   Establishing a connection to the MongoDB database.
*   Mounting the application's routes.
*   Handling errors.

### 2. Routing (`routes/`)

The `routes/` directory contains the application's route handlers. Each file in this directory corresponds to a specific area of the application (e.g., `admin.js`, `product.js`, `order.js`). The routes define the application's API and are responsible for processing incoming requests and generating responses.

### 3. Database (`lib/db.js`)

The application uses MongoDB for data persistence. The `lib/db.js` file is responsible for establishing a connection to the database. The application's data models are defined by the schemas in the `lib/schemas` directory.

### 4. Configuration (`config/`)

The `config/` directory contains the application's configuration files. The main configuration file is `settings.json`, which defines settings for the application, such as the theme, payment gateways, and available languages. The `config/payment/` directory contains configuration files for the various payment gateways.

### 5. Modules (`lib/`)

The `lib/` directory contains various modules that provide specific functionalities. These modules are used by the route handlers to perform tasks such as processing payments, managing the shopping cart, and sending emails.

### 6. Views (`views/`)

The `views/` directory contains the Handlebars templates for the application's user interface. The templates are organized into layouts, partials, and themes. The `layout.hbs` file defines the main layout of the application, and the partials are used to render reusable components.

## Data Flow

1.  A user sends a request to the application.
2.  The Express.js server receives the request and passes it to the appropriate route handler in the `routes/` directory.
3.  The route handler processes the request, interacts with the database (via `lib/db.js`), and uses the modules in the `lib/` directory to perform any necessary tasks.
4.  The route handler then renders the appropriate view from the `views/` directory, passing any necessary data to the template.
5.  The Handlebars templating engine renders the HTML, which is then sent back to the user's browser.
