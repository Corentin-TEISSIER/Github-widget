# GITHUB WIDGET v.1.0

The goal of this project is to create a small software that display some datas about your personnal github repositories.
This software is an easy way to keep an eye on the modifications made on your repositories.

## Build

### Dependencies
- nodeJs : **v.18.15.0**
- npm : **v.9.5.0**
- dotenv : **v.16.0.3**
- electron : **v.23.1.3**
- electron forge : **v.6.0.5**
- octokit : **v.2.0.14**

### Build the software

You first need to download the project. Then you must install the npm dependencies:

`cd /directory/of/the/project`

`npm install`

And to create the app package:

`npx electron-forge make`

You can refer to "electron-forge make" options if you want to perosnalise you installation package.

Then you can find the application in the directory /out/github-widget-:platform/ of the project.

You will also find an application installer 'github-widget-1.0.0 Setup' in the folder /out/make/path-to-plateform/.

NB: This project still have some troubles that need to be solved. If you install the app, you better should launch it as an administrator to get the access on some files (.env) and also maybe relaunch it once you setted the git data to see the changes.

### Development

You first need to download the project. Then you must install the npm dependencies:

`cd /directory/of/the/project`

`npm install`

Then, to launch the app in dev:

`npm start`

Tips: the boolean 'devToolActivate' at the beginning of file 'main.js' could be set to true to display the devTools.

## How to setup the app

Fist you need to create a personnal access token on github:
- go on github.com.
- connect on you account.
- go to you account's settings.
- go to <> Developer settings.
- click on 'Personal access tokens/ Tokens (classic)'.
- Click on 'Generate new token/ Generate new token (classic)'.
- Fill the form, the only requirement to make the app working correctly is to tick all the repo area's boxes.
- You personnal access token will be created and you will be able to copy it. Be careful, as soon as you'll leave this page you will not be able to check for you personnal access token value. 

When you launch the application you can click on the setup button (if this is the first time you launch the app) or on the gear button. A new page will open on which you can register your github account's username and personnal token to access it.

By clicking on "register", the data in the fillin areas will be used as new data to set the app up. If you let those area empty, it is a better option to click on "cancel" to do not apply empty strings as new set up data.


## Contact

Corentin TEISSIER
email: corentinteiss@yahoo.fr
phone: +33 (0)6 95 65 90 48