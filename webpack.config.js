const path = require('path')

module.exports = (config) => {
    config.resolve.modules.push('./src')
    config.target = 'electron-renderer';
    // Enable babel loader for react-pivot
    config.module.rules.push({
        ...config.module.rules[2],
        include: path.resolve(__dirname, 'node_modules/react-pivot/index.js'),
    })
    
    return config;
}
