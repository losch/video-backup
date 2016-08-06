module.exports = {
    paths: {
      public: 'public',
      watched: ['app',
                'test',
                'vendor',
                'node_modules/spinkit/css/spinners/9-cube-grid.css']
    },
    files: {
        javascripts: {
            joinTo: 'app.js'
        },
        stylesheets: {
          joinTo: {
            'main.css': /^app/,
            'vendor.css': /^node_modules/
          }
        }
    },
    modules: {
      autoRequire: {
        'app.js': ['app']
      }
	}
};
