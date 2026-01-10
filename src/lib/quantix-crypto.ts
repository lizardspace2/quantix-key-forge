
// Simulated Post-Quantum Cryptography (Dilithium + SHA256) + UTXO Logic
// Compatible with the provided NaivecoinStake-like backend

export interface TxOut {
    address: string;
    amount: number;
}

export interface TxIn {
    txOutId: string;
    txOutIndex: number;
    signature: string;
}

export interface Transaction {
    id: string;
    txIns: TxIn[];
    txOuts: TxOut[];
}

export interface UnspentTxOut {
    txOutId: string;
    txOutIndex: number;
    address: string;
    amount: number;
}

export interface KeyPair {
    publicKey: string;
    privateKey: string;
}

const enc = new TextEncoder();

function buf2hex(buffer: Uint8Array): string {
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// SHA256 Helper (Async)
export const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = enc.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return buf2hex(new Uint8Array(hashBuffer));
};

// --- Keys & Addresses ---

export const generateKeyPair = async (): Promise<KeyPair> => {
    // Simulate Dilithium2 Key Generation
    await new Promise(resolve => setTimeout(resolve, 600));

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
    // In this backend, the "Address" IS the hex public key (1312 bytes hex = 2624 chars), 
    // or sometimes a hash of it depending on implementation. 
    // The user's backend `isValidAddress` checks for length 1472 bytes sometimes or hex chars.
    // Ideally it's the raw public key hex for Post-Quantum direct verification.
    return publicKey;
};

// --- Transaction Construction (UTXO Model) ---

export const getTransactionId = async (transaction: Omit<Transaction, 'id'>): Promise<string> => {
    const txInContent = transaction.txIns
        .map(txIn => txIn.txOutId + txIn.txOutIndex)
        .join('');

    const txOutContent = transaction.txOuts
        .map(txOut => txOut.address + txOut.amount)
        .join('');

    return await sha256(txInContent + txOutContent);
};

export const signTxIn = async (
    transaction: Transaction,
    txInIndex: number,
    privateKey: string,
    unspentTxOuts: UnspentTxOut[]
): Promise<string> => {
    const txIn = transaction.txIns[txInIndex];
    const dataToSign = transaction.id;

    // In a real implementation: verify ownership here
    // const referencedUTxO = unspentTxOuts.find(u => u.txOutId === txIn.txOutId && u.txOutIndex === txIn.txOutIndex);

    // Simulate Dilithium Signature
    // Signature size ~2420 bytes
    const signature = await createDilithiumSignature(dataToSign, privateKey);
    return signature;
};

const createDilithiumSignature = async (message: string, privateKey: string): Promise<string> => {
    // Simulate heavy crypto math
    await new Promise(resolve => setTimeout(resolve, 100));
    const hash = await sha256(message + privateKey);
    let sig = hash;
    while (sig.length < 4840) sig += hash; // Fill to ~2420 bytes
    return sig.slice(0, 4840);
};

export const createTransaction = async (
    receiverAddress: string,
    amount: number,
    privateKey: string,
    unspentTxOuts: UnspentTxOut[],
    // transactionPool: Transaction[] = [] // Ignored for client-side simpl.
): Promise<Transaction> => {
    const myAddress = deriveAddress(JSON.parse(JSON.stringify({ publicKey: privateKey })).publicKey || privateKey.slice(0, 10)); // Hacky derivation/check
    // In reality, we'd pass the public key or deriving it from private is complex without the lib.
    // For this mock, we assume the caller filters the UTXOs correctly for "myAddress" inputs.

    const myUTXOs = unspentTxOuts; // Assume these belong to sender

    // 1. Find unspent outputs to cover amount
    let currentAmount = 0;
    const includedUnspentTxOuts: UnspentTxOut[] = [];

    for (const myUnspentTxOut of myUTXOs) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount += myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;

            // Create TxIns
            const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(uTxO => ({
                txOutId: uTxO.txOutId,
                txOutIndex: uTxO.txOutIndex,
                signature: ''
            }));

            // Create TxOuts
            const txOuts: TxOut[] = [
                { address: receiverAddress, amount: amount }
            ];

            if (leftOverAmount > 0) {
                // Change back to self (assuming first UTXO address is ours)
                txOuts.push({ address: myUTXOs[0].address, amount: leftOverAmount });
            }

            // Construct Transaction
            const tx: Transaction = {
                id: '',
                txIns: unsignedTxIns,
                txOuts: txOuts
            };

            tx.id = await getTransactionId(tx);

            // Sign TxIns
            for (let i = 0; i < tx.txIns.length; i++) {
                tx.txIns[i].signature = await signTxIn(tx, i, privateKey, myUTXOs);
            }

            return tx;
        }
    }

    throw new Error('Insufficient funds to cover amount');
};
