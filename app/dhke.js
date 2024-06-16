async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-521",
        },
        true, // whether the key is extractable (i.e., can be used in exportKey)
        ["deriveKey", "deriveBits"] // can be used for these operations
    );

    return keyPair;
}

async function deriveSharedSecret(privateKey, publicKey) {
    const sharedSecret = await window.crypto.subtle.deriveBits(
        {
            name: "ECDH",
            public: publicKey,
        },
        privateKey,
        256 // the number of bits to derive
    );

    return sharedSecret;
}

async function exportPublicKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        "raw",
        key
    );
    return exported;
}

async function importPublicKey(keyData) {
    const key = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        {
            name: "ECDH",
            namedCurve: "P-521",
        },
        true, // whether the key is extractable (i.e., can be used in exportKey)
        []
    );

    return key;
}
