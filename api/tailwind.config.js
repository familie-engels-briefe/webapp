const colors = require('tailwindcss/colors')

module.exports = {
    theme: {
        extend: {
            colors: {
                teal: colors.teal,
            }
        }
    },
    variants: {},
    plugins: [],
    purge: {
        enabled: true,
        content: ['./resources/views/**/*.blade.php']
    },
}
