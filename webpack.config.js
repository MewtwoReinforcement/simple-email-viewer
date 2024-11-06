import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: './client/index.tsx',
  output: {
    path: path.join(import.meta.dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  plugins: [new HtmlWebpackPlugin({ template: './client/index.html' })],
  devServer: {
    static: {
      directory: path.resolve(import.meta.dirname, './client'),
    },
    port: 8080,
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};
