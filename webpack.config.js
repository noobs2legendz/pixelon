var path = require('path');
module.exports = {
	module: {
		loaders: [
			{
		      test: /\.js$/,
		      exclude: /(node_modules|bower_components)/,
		      loader: 'babel', // 'babel-loader' is also a legal name to reference
		      query: {
		        presets: ['es2015', 'react']
		      }
		    }
		],
	},
    entry: {
        app: './client/src/app.js'
    },
    output: {
        filename: './client/dist/[name].js'
    },
    watch: true
};
