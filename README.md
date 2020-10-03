# Bvillage-2020_OIDC
- It is the source code of bvillage, a web application for international student.
- The installation will explain how to test in the local environment, and if the public IP address is leaked, security problems can be accrued. It will be provided to the OIDC in a different way later if necessary.
- Both Mobile and Desktop can be run, but if you want to see a more optimized screen, it is recommended to connect in the mobile environment.

# Installation
You need node.js for the test. <https://nodejs.org/en/download/>

Up to the latest version of nodejs can be supported.


In the app directory, you can execute with the following command: 


`node main.js`


If 'pm2'(package manager for node.js) is installed, the following code is also possible:

`pm2 start main.js` or `pm2 start main.js --watch`

# Browser Support
- Latest version of Chrome browser is OK.
- Latest version of Firefox browser is OK.
- Latest version of Whale browser is OK.
- Latest version of Microsoft Edge browser has problems with some css layout functions.
- Internet Explorer browser has problems with some css layout functions and displaying Google charts.

