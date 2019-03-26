# drupal-8-webpack-hmr
**A Drupal 8 theme base with Webpack preconfigured for HMR.**

When developing locally, I had hit a lot of pain points trying to get webpack-dev-server to successfully proxy an Apache driven site. Logging in to the site through localhost would redirect to the apache set domain, not setting the cookie on localhost - proxying the dev server with browsersync would fix this problem but cause mixed results. 

This theme base should allow you to add Webpack to your existing theme, or start a new one, allowing you to proxy an HTTPS only Drupal 8 site on Apache. It supports hot module replacement with CSS and Vue and includes the basic Drupal yml files to load your dist files, and launch a webpack dev server instance.

## What's Included

- Drupal 8 Theme Libraries
- Webpack 4
- ES6 support with Babel
- SASS support with autoprefixer
- Vue support

## Structure

```
│   drupal-8-webpack-hmr.info.yml
│   drupal-8-webpack-hmr.libraries.yml
│   webpack.config.js
│   
└───assets
       ├───dist
       │    ├───css
       │    |     app.css
       │    └───js
       │          app.js
       ├───js
       │     app.js
       └───sass
             app.scss
```

## Installation

### Clone this repo

Use this directory as your theme base, or copy the files to your existing theme.

```
git clone https://github.com/csymlstd/drupal-8-webpack-hmr.git
```

### Install dependencies

```
npm install --save-dev
```

### Configure Webpack
In your `webpack.config.js` file
- Update the `PROXY` variable with the full domain to proxy: `https://drupal8.dd:8443`
- If you are proxying a non-https site, change the devServer `https` property to `false`.

### Configure Drupal
- Update your `settings.php` to trust localhost and configure local development.
```
$settings['trusted_host_patterns'] = array(
 '^drupal8\.dd$',
 '^localhost$',
 '^.+\localhost$',
 '^localhost\:8181$',
 '^.+\localhost\:8181$',
);

if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  include $app_root . '/' . $site_path . '/settings.local.php';
}
```
- Use a [settings.local.php](https://gist.github.com/csymlstd/cf86e94c172969eb27d4d71441979a5f) file to disable render cache, internal page cache, dynamic page cache.

## Usage
The default entry file can be found at `assets/js/app.js`. Include your theme JS here.

There are two predefined scripts in `package.json` to start your local dev server.

**To watch files with hot module replacement:**
```
npm start
```
The dev server will now be accessible from `https://localhost:8181`
This will generate files within memory, accessible from `https://localhost:8181/themes/drupal-8-webpack-hmr/assets/dist`

**To build files for production:**
```
npm run build
```
This will minify all assets and generate files within `assets/dist`
