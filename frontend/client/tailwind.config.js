/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "background": "url(/src/assets/RevendoBG3.png)",
        "logo": "url(/src/assets/Revendo.png)",
        "backgroundMain": "url(/src/assets/RevendoBG.png)",
      },
      screens: {
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }
  
        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }
        'burger': '899px',
        // => @media (min-width: 1280px) { ... }
        'tabletH': '600px',
        // => @Home (min-width: 600px) { ... }
        'laptopH': '1050px',
        // => @Home (min-width: 600px) { ... }
        'imgH': '1300px',
        'bigH': '1830px'
      },
      colors:{
        'discord': '#7289DA',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('flowbite/plugin'),
  ],
}
