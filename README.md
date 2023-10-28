# Installation instructions

1. In the /server directory, create a file called .env and paste the provided database connection string in the file like so: `ATLAS_URI=xxxxxxxxxxxxxxxx`
2. Run `npm ci` in both the /client and the /server directory.
3. Run `npm start` simultaneously in /client and /server.
4. The application is now usable on http://localhost:4200/

> Everytime when the server is started, the script generateJwtSecret.js will run. 
> This script checks the .env file for the existence of a JWT secret key. If it does not exist, it will create one and place it in the file. 
> For running the application it doesn't really matter what that key is, but beware that as soon as it changes,
> all JWT tokens in use by any authenticated users will be invalid.
