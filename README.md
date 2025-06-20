# MindMeal

This project is a recipe generator using React, HTML, CSS, and OpenRouterAI. 
It utilises serverless functions to protect API keys and Cloudflare Turnstiles to minimise bot interactions.

## Working Demo
![Screenshot 2025-06-20 at 6 34 48 am](https://github.com/user-attachments/assets/f22006a0-c03b-4fb2-bbf7-8e18ebe96132)


## Description

The application allows users to:

- Add ingredients to the list.
- Remove ingredients from the list.
- Generate recipes from the list of ingredients created.

## Getting Started

### Installing and Running

1. Clone this repository
    ```
    git clone <your-repo-link>
    ```

2. Install dependencies.
    ```
    npm i
    ```

4. Create a .env file and create the following env variables:
- VITE_OPEN_ROUTER_ACCESS_TOKEN ([http://openrouter.ai/](https://openrouter.ai/))
- VITE_TURNSTILE_SITE_KEY ([Cloudflare](https://www.cloudflare.com/en-au/application-services/products/turnstile/))
- VITE_TURNSTILE_SECRET_KEY

5. Create your Netlify account. ([https://www.netlify.com/](https://www.netlify.com/)

6. Configure your Netlify account in your command line.
    ```
    ntl init
    ```

7. Launch Netlify Dev mode.
    ```
    ntl dev
    ```

## Project Structure

- `App.jsx` - The main file pulling together the major components of the site
- `components` - The components comprising the header, ingredients list, recipe section and the actual main page.
- `netlify/functions` - The serverless functions are used to fetch recipes and validate Turnstile Tokens with their respective API keys securely.
- `App.css` - The CSS file for styling the HTML content.


## Author

Warren Kuah
