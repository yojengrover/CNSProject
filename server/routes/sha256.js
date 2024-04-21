// Helper functions for SHA-256
function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
}

function sha256(salt, message) {
    message += salt
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    const initialHashValues = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const chunks = [];
    let chunkIndex = 0;
    let messageLength = message.length * 8;

    // Pre-processing
    message += String.fromCharCode(0x80); // Append '1' bit to the message
    while ((message.length + 8) % 64 !== 0) {
        message += String.fromCharCode(0x00); // Append '0' bits
    }
    message += String.fromCharCode((messageLength >> 56) & 0xff);
    message += String.fromCharCode((messageLength >> 48) & 0xff);
    message += String.fromCharCode((messageLength >> 40) & 0xff);
    message += String.fromCharCode((messageLength >> 32) & 0xff);
    message += String.fromCharCode((messageLength >> 24) & 0xff);
    message += String.fromCharCode((messageLength >> 16) & 0xff);
    message += String.fromCharCode((messageLength >> 8) & 0xff);
    message += String.fromCharCode((messageLength >> 0) & 0xff);

    // Process each 512-bit chunk
    for (let i = 0; i < message.length; i += 64) {
        chunks[chunkIndex++] = message.substring(i, i + 64);
    }

    // Main loop
    for (let chunk of chunks) {
        let words = [];
        for (let j = 0; j < 16; j++) {
            words[j] = (
                (chunk.charCodeAt(j * 4) & 0xff) << 24 |
                (chunk.charCodeAt(j * 4 + 1) & 0xff) << 16 |
                (chunk.charCodeAt(j * 4 + 2) & 0xff) << 8 |
                (chunk.charCodeAt(j * 4 + 3) & 0xff)
            );
        }

        for (let j = 16; j < 64; j++) {
            const s0 = rightRotate(words[j - 15], 7) ^ rightRotate(words[j - 15], 18) ^ (words[j - 15] >>> 3);
            const s1 = rightRotate(words[j - 2], 17) ^ rightRotate(words[j - 2], 19) ^ (words[j - 2] >>> 10);
            words[j] = (words[j - 16] + s0 + words[j - 7] + s1) & 0xffffffff;
        }

        let [a, b, c, d, e, f, g, h] = initialHashValues;
        
        for (let j = 0; j < 64; j++) {
            const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h + S1 + ch + K[j] + words[j]) & 0xffffffff;
            const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) & 0xffffffff;
            
            h = g;
            g = f;
            f = e;
            e = (d + temp1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) & 0xffffffff;
        }

        // Update hash values
        initialHashValues[0] = (initialHashValues[0] + a) & 0xffffffff;
        initialHashValues[1] = (initialHashValues[1] + b) & 0xffffffff;
        initialHashValues[2] = (initialHashValues[2] + c) & 0xffffffff;
        initialHashValues[3] = (initialHashValues[3] + d) & 0xffffffff;
        initialHashValues[4] = (initialHashValues[4] + e) & 0xffffffff;
        initialHashValues[5] = (initialHashValues[5] + f) & 0xffffffff;
        initialHashValues[6] = (initialHashValues[6] + g) & 0xffffffff;
        initialHashValues[7] = (initialHashValues[7] + h) & 0xffffffff;
    }

    // Final hash value
    let hash = "";
    for (let value of initialHashValues) {
        hash += ("00000000" + value.toString(16)).slice(-8);
    }
    return hash;
}

module.exports = sha256;
