const path = require('path');

module.exports = (config) => {
    // Extend the default Webflow Webpack configuration here

    // Example: Add an alias
    config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
    };

    // Add CSS rule to support Tailwind via PostCSS
    // This ensures local Webflow development matches the Vite/Next.js styles
    config.module.rules.push({
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            ['@tailwindcss/postcss']
                        ],
                    },
                },
            },
        ],
    });

    return config;
};
