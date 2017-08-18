const path = require('path');

module.exports = {
    iconset: {
        src: [ path.join(process.cwd(), 'scripts', 'iconset.js') ]
    },
    licenses: {
        src: [ path.join(process.cwd(), 'scripts', 'licenses.js') ]
    },
    inlineComponentsLess: {
        src: [ path.join(process.cwd(), 'scripts', 'inline-components-less.js') ]
    }
};