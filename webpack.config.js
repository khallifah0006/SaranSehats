const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    // Entry point - your main JavaScript file
    entry: './src/js/index.js',
    
    // Output configuration
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true, // Clean the output directory before emit
    },
    
    // Module rules for different file types
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    },
    
    // Plugins
    plugins: [
       new CopyPlugin({
    patterns: [
      { from: './src/html/tes.html', to: 'tes.html' }, // Salin tes.html
  { from: './src/html/berenang.html', to: 'berenang.html' }, // Salin tes.html
    { from: './src/html/berjalan.html', to: 'berjalan.html' }, // Salin tes.html
      { from: './src/html/bersepeda.html', to: 'bersepeda.html' }, // Salin tes.html
        { from: './src/html/hiit.html', to: 'hiit.html' }, // Salin tes.html
          { from: './src/html/kardio.html', to: 'kardio.html' }, // Salin tes.html
           { from: './src/html/senam.html', to: 'senam.html' }, 
            { from: './src/html/weightlifting.html', to: 'weightlifting.html' }, 
             { from: './src/html/yoga.html', to: 'yoga.html' },
             { from: './src/html/tentangkami.html', to: 'tentangkami.html' },
                { from: './src/css/tes.css', to: 'tes.css' },
                   { from: './src/css/styles.css', to: 'styles.css' },
                      { from: './src/css/homepagestyles.css', to: 'homepagestyles.css' },
                      { from: './src/css/tentangkami.css', to: 'tentangkami.css' },
            { from: './src/img', to: 'img' }
    ],
  }),
      new HtmlWebpackPlugin({
        template: './index.html', // Use your existing HTML as template
        filename: 'index.html',   // Output filename in dist folder
        inject: 'body'            // Inject scripts at the end of body
      })
    ],
    
    // Development server configuration
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'), // Serve from dist folder
      },
      compress: true,
      port: 8080,
      hot: true,
      open: true,
      historyApiFallback: true, // For SPA routing
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    
    // Source maps for debugging
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    
    // Mode
    mode: isProduction ? 'production' : 'development',
    
    // Optimization
    optimization: {
      minimize: isProduction,
    },
    
    // Resolve configuration
    resolve: {
      extensions: ['.js', '.json'],
    },
    
    // Performance hints
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }
  };
};