import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	createMintToInstruction,
	getAssociatedTokenAddressSync,
	getMint,
	TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
	WalletDisconnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PublicKey, Transaction } from "@solana/web3.js";
import React, { useState } from "react";

const MintToken = () => {
	const [mint, setMint] = useState("");
	const [amount, setAmount] = useState(0);

	const wallet = useWallet();
	const { connection } = useConnection();

	const mintToken = async () => {
		try {
			if (!wallet.publicKey) {
				alert("Please connect your wallet first");
				return;
			}

			const associatedTokenAcc = getAssociatedTokenAddressSync(
				new PublicKey(mint),
				wallet.publicKey,
				false,
				TOKEN_2022_PROGRAM_ID,
				ASSOCIATED_TOKEN_PROGRAM_ID
			);

			console.log(associatedTokenAcc.toBase58());

			const mintInfo = await getMint(
				connection,
				new PublicKey(mint),
				"confirmed",
				TOKEN_2022_PROGRAM_ID
			);

			const LAMPORTS_PER_TOKEN = 10 ** mintInfo.decimals;
			const transaction = new Transaction().add(
				createMintToInstruction(
					new PublicKey(mint),
					associatedTokenAcc,
					wallet.publicKey,
					amount * LAMPORTS_PER_TOKEN,
					[],
					TOKEN_2022_PROGRAM_ID
				)
			);

			// const latestBlockhash = await connection.getLatestBlockhash();
			// transaction.recentBlockhash = latestBlockhash.blockhash;
			// transaction.feePayer = wallet.publicKey;

			// const signedTransaction = await  wallet.signTransaction(transaction);

			// const signature = await connection.sendRawTransaction(signedTransaction.serialize());

			// console.log("Transaction confirmed:", signature);

			await wallet.sendTransaction(transaction, connection);
			alert("Token minted successfully!");
			setAmount(0);
			setMint("");
		} catch (e) {
			alert("Error Minting token : " + e.message);
			console.log("Error", e.message);
		}
	};

	return (
		<div
			style={{
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					gap: "40px",
				}}
			>
				<WalletMultiButton />
				<WalletDisconnectButton />
			</div>
			<h1>Solana Token Mint</h1>
			<input
				className="inputText"
				type="text"
				placeholder="Mint Address"
				onChange={(e) => setMint(e.target.value)}
			></input>{" "}
			<br />
			<input
				className="inputText"
				type="text"
				placeholder="Amount"
				onChange={(e) => setAmount(Number(e.target.value))}
			></input>{" "}
			<br />
			{/* <input
				className="inputText"
				type="text"
				placeholder="Initial Supply"
				// onChange={(e) => setSupply(e.target.value)}
			></input>{" "}
			<br /> */}
			<button className="btn" onClick={mintToken}>
				Mint Token
			</button>
		</div>
	);
};

export default MintToken;
