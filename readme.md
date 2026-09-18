# Currency Converter

A real-time currency converter web application.

## Features

- Convert between 150+ world currencies
- Real-time exchange rates from `open.er-api.com`
- Flag icons displayed next to currency selectors
- Swap currencies button
- Number formatting with commas
- Exchange rate caching for performance

## Project Structure

```
currency exchange/
├── index.html          # Main HTML file
├── readme.md           # This file
├── public/
│   └── logo.ico        # Project icon
├── static/
│   ├── css/
│   │   └── style.css   # Styles (Poppins font, dark theme)
│   └── js/
│       ├── country-list.js  # Currency code to country code mapping
│       └── script.js        # Conversion logic and UI interactions
```

## How It Works

1. User enters an amount and selects "From" and "To" currencies
2. `script.js` fetches exchange rates from `https://open.er-api.com/v6/latest/{baseCurrency}`
3. Rates are cached to reduce API calls
4. Conversion is calculated and displayed in real-time
5. Flag images update based on selected currency codes

## Running

Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).