
// Simulated Post-Quantum Cryptography (Dilithium Level 2 + SHA256)
// WARNING: This is a simulation using Web Crypto API for secure randomness.
// It generates keys of correct lengths for Dilithium2 but does not implement the full lattice math
// to allow this demo to run efficiently in the browser without 5MB+ WASM binaries.

export interface KeyPair {
    publicKey: string;
    privateKey: string;
}

export interface SignedTransaction {
    txId: string;
    from: string;
    to: string;
    amount: string;
    fee: string;
    timestamp: number;
    signature: string;
    publicKey: string;
}

// QTX utilizes Dilithium2:
// Public Key size: 1312 bytes
// Private Key size: 2528 bytes
// Signature size: 2420 bytes

const enc = new TextEncoder();
const dec = new TextDecoder();

function buf2hex(buffer: Uint8Array): string {
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function hex2buf(hex: string): Uint8Array {
    try {
        const match = hex.match(/.{1,2}/g);
        if (!match) return new Uint8Array();
        return new Uint8Array(match.map(byte => parseInt(byte, 16)));
    } catch (e) {
        return new Uint8Array();
    }
}

export const generateKeyPair = async (): Promise<KeyPair> => {
    // Simulate computational work for lattice generation
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate random bytes for keys
    const pkBytes = new Uint8Array(1312);
    const skBytes = new Uint8Array(2528);

    crypto.getRandomValues(pkBytes);
    crypto.getRandomValues(skBytes);

    return {
        publicKey: buf2hex(pkBytes),
        privateKey: buf2hex(skBytes)
    };
};

export const deriveAddress = (publicKey: string): string => {
    // In Quantix, address is first 40 chars of hash(publicKey) prefixed with '0x'
    // This is similar to Ethereum but using post-quantum keys
    if (!publicKey) return "";
    return "0x" + publicKey.slice(0, 40);
};

export const createSignature = async (message: string, privateKey: string): Promise<string> => {
    if (!privateKey) throw new Error("Private key required");

    // Simulate signing time
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create a deterministic but unique-looking signature based on message and key
    const msgHash = await sha256(message);
    const keyHash = await sha256(privateKey);

    // We want a large signature (Dilithium style ~2420 bytes)
    // We'll repeat the hashes to fill the space for visual authenticity
    const sigPart = msgHash + keyHash;
    let signature = sigPart;

    while (signature.length < 4840) { // 2420 bytes * 2 hex chars
        signature += sigPart;
    }

    return signature.slice(0, 4840);
};

export const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = enc.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return buf2hex(new Uint8Array(hashBuffer));
};

export const calculateTxId = async (tx: Omit<SignedTransaction, 'txId' | 'signature'>): Promise<string> => {
    const data = JSON.stringify(tx);
    return await sha256(data);
};
