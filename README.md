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

### Development

You first need to download the project. Then you must install the npm dependencies:
`cd /directory/of/the/project`
`npm install`
Then, to launch the app in dev:
`npm start`

Tips: the boolean 'devToolActivate' at the beginning of file 'main.js' could be set to true to display the devTools.

## Contact

Corentin TEISSIER
email: corentinteiss@yahoo.fr
phone: +33 (0)6 95 65 90 48