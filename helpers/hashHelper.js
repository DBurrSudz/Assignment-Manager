const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;

module.exports = {
    /**
     * Hashes the password password submitted by a client. 
     * @param {string} password The plaintext password to be hashed.
     * @returns {string}
     */
    hashInformation: async (password) => {
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        return await bcrypt.hash(password,salt);
    }

}