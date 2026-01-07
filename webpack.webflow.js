const path = require('path');

module.exports = (config) => {
    // Extend the default Webflow Webpack configuration here

    // Example: Add an alias
    config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
    };

    // Example: Add a rule for CSS if you are importing CSS files directly
    // Note: Webflow's bundler handles many things by default, but you can override.

    return config;
};
