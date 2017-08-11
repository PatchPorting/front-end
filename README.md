# How to use it

 At the moment, you need to run a user-script (`script-plugin.user.js`) on Greasemonkey for Firefox (not tested on Chromium/Tampermonkey(?), but it should work):
 * Get greasemonkey here: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
 * Get the userscript here: https://github.com/PatchPorting/front-end/blob/master/script-plugin.user.js

You don’t need to have a token for just looking around or downloading existing patches. For creating your own patches, you will need a token (since it needs pushing to the DB). To retrieve a token, please contact luciano@debian.org (remember that the platform is in the alpha phase, so proceed carefully).

---

_The following steps are not necessary to use the script. Only follow the below steps if you plan to run locally or for development purposes_

## Run app

Install node dependencies

```
$ npm install
```

Install webpack

```
$ npm install -g webpack
```

Run application

```
$ npm start
```

## For development

Install node dependencies

```
$ npm install
```

Install webpack-dev-server

```
$ npm install -g webpack-dev-server
```

Run application
```
$ npm run dev
```
