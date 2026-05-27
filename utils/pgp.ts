import * as openpgp from 'openpgp';

// 1. Key Pair (Public & Private Key) generator
export async function generatePGPKeys(name: string, email: string) {
    const { privateKey, publicKey } = await openpgp.generateKey({
        type: 'ecc', // Fast and secure
        curve: 'ed25519' as any,
        userIDs: [{ name, email }],
    });
    return { privateKey, publicKey };
}

// 2. encryptText
export async function encryptText(text: string, publicKeyArmored: string) {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored }) as openpgp.PublicKey;
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text }),
        encryptionKeys: publicKey,
    });
    return encrypted as string;
}

// 3.encryptText
export async function decryptText(encryptedText: string, privateKeyArmored: string) {
    const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored }) as openpgp.PrivateKey;
    const message = await openpgp.readMessage({ armoredMessage: encryptedText });
    const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey,
    });
    return decrypted as string;
}
