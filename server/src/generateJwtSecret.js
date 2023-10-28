const fs = require('fs');
const crypto = require('crypto');

/**
 * This function runs on server initialization. It generates a JWT secret when it doesn't exist yet in
 * the .env file. This increases portability, so that it can be installed anywhere without having to share
 * or generate a new secret manually.
 */
export function setJwtSecret() {
    try {
        console.log('Checking for JWT secret key');
        const envData = fs.readFileSync('.env', 'utf-8');
        if (envData.includes('JWT_SECRET_KEY')) {
            console.log('JWT secret already set, using existing secret');
            return;
        }
        console.log('No JWT secret found in .env. Setting a new secret. Existing tokens will be invalid');
        const secretKey = crypto.randomBytes(32).toString('hex');
        fs.appendFileSync('.env', `\r\nJWT_SECRET_KEY=${secretKey}`);
        console.log('JWT secret generation successful.');

    } catch (e) {
        console.log(e);
    }
}



