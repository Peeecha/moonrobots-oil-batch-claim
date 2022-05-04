# Description
Simple script to help you collect all oil rewards at once.

# Private Keys - WARNING!
This script will need your private key to work. 
This is not production ready code. Please be very careful with your private key and never push it to a public repository. 
It's advised that you use an account that doesn't have all your funds attached to it.

Proceed only if you are comfortable leaving your key on your computer.

# Installation

 - Install [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
 - Download the repository via the green "Code" button at the top of this page
 - Unzip the file to a location of your choice
 - Open up a cmd window and navigate to the unzipped location
 - In the cmd window, run the command to install the dependencies

```npm install```

# Configuration

This is the part where you will be handling with your private key. Make sure your computer is not compromised. If you are copy pasting your key from metamask, don't leave it hanging in your clipboard afterwards.

Make a copy of the `env_sample` file and rename it to `.env`
Open the `.env` file in your favourite text editor and enter your private key after the `PRIVATE_KEY=`

`.env` first row of this file contains the RPC address. Currently it is set to Cosmic RPC [link](https://twitter.com/thecosmicguild/status/1493879413364121601), which I find to be reasonably fast. You can change it to whatever RPC you prefer.

# Running

Being in the unzipped folder location in the cmd window, run the script with the command:

```npm start```
