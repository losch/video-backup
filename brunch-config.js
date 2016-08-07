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
            joinTo: 'static/app.js'
        },
        stylesheets: {
          joinTo: {
            'static/main.css': /^app/,
            'static/vendor.css': /^node_modules/
          }
        }
    },
    modules: {
      autoRequire: {
        'static/app.js': ['app']
      }
	}
};
