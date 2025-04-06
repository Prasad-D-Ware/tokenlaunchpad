import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { createInitializeMint2Instruction, createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function TokenLaunchpad() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const createToken = async () =>{
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const mintAccount = Keypair.generate();

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintAccount.publicKey,
                space: MINT_SIZE,
                lamports,
                programId : TOKEN_PROGRAM_ID,
            }),
            createInitializeMint2Instruction(mintAccount.publicKey, 5, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID),
        );
        
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = wallet.publicKey;
        
        transaction.partialSign(mintAccount);

        await wallet.sendTransaction(transaction , connection);
        alert("Transaction Complete")
    }

    return  <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <div style={{
            display : "flex",
             justifyContent : "space-between",
            gap : "40px"
       }}>
            <WalletMultiButton />
            <WalletDisconnectButton />
       </div>
        <h1>Solana Token Launchpad</h1>
        <input className='inputText' type='text' placeholder='Name'></input> <br />
        <input className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input className='inputText' type='text' placeholder='Initial Supply'></input> <br />
        <button className='btn' onClick={createToken}>Create a token</button>
    </div>
}
