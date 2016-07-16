 var CleanWebpackPlugin = require('clean-webpack-plugin');
 var CopyWebpackPlugin = require('copy-webpack-plugin');
 var path = require('path');
  
 var output = "bin";
 
 module.exports = {
     context: path.join(__dirname, ''),
     entry: "./app/main.js",
     output: {
         path: path.join(__dirname, output),
         filename: path.join("js", "bundle.js")
     },
     plugins: [
         new CleanWebpackPlugin([output]),
         new CopyWebpackPlugin([
             { from: 'index.prod.html', to: "index.html" },
            { from: "js/**/*.js" },
            { from: "css/**/*.css" }
         ])
     ]
 };
