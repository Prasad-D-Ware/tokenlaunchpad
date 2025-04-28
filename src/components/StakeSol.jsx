import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	createBurnInstruction,
	getOrCreateAssociatedTokenAccount,
	mintTo,
	TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
	WalletDisconnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
	sendAndConfirmTransaction,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import React, { useState } from "react";
import bs58 from "bs58";

const STAKING_ADDRESS = import.meta.env.VITE_STAKING_ADDRESS;
const MINT_ADDRESS = import.meta.env.VITE_MINT_ADDRESS;

const Stake = () => {
	const [amount, setAmount] = useState(0);
	const [unStakeAmount, setUnstakeAmount] = useState(0);
	const [lst, setLst] = useState();
	const [unstakeSol, setUnstakeSol] = useState();

	const wallet = useWallet();

	const { connection } = useConnection();

	const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

	const setLSTAmount = (amount) => {
		setTimeout(() => setLst(amount), 3000);
	};

	const setSolAmount = (amount) => {
		setTimeout(() => setUnstakeSol(amount), 3000);
	};

	function base58ToKeypair(base58PrivateKey) {
		try {
			const privateKeyBuffer = bs58.decode(base58PrivateKey);
			return Keypair.fromSecretKey(privateKeyBuffer);
		} catch (error) {
			throw new Error("Invalid base58 private key.");
		}
	}
	const payer = base58ToKeypair(SECRET_KEY);

	const stakeSol = async () => {
		try {
			// console.log("Staking sol", amount);

			if (!wallet.publicKey) {
				alert("Please connect your wallet first");
				return;
			}

			if (!amount) {
				alert("Please enter a valid staking amount");
				return;
			}

			const transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: wallet.publicKey,
					toPubkey: new PublicKey(STAKING_ADDRESS),
					lamports: amount * LAMPORTS_PER_SOL,
				})
			);

			// console.log("before ata")
			const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
				connection,
				payer,
				new PublicKey(MINT_ADDRESS),
				wallet.publicKey,
				true,
				null,
				null,
				TOKEN_2022_PROGRAM_ID,
				ASSOCIATED_TOKEN_PROGRAM_ID
			);

			// console.log(associatedTokenAccount.address);

			const lstTokenAmount = amount;
			const decimals = 9;

			// transaction.add(
			//   createMintToInstruction(
			//     new PublicKey(MINT_ADDRESS),
			//     associatedTokenAccount.address,
			//     new PublicKey(STAKING_ADDRESS),
			//     lstTokenAmount * (10 ** decimals),
			//     [],
			//     TOKEN_2022_PROGRAM_ID
			//   )
			// )

			transaction.feePayer = wallet.publicKey;
			transaction.recentBlockhash = (
				await connection.getLatestBlockhash()
			).blockhash;

			await wallet.sendTransaction(transaction, connection);

			alert("Staked Solana and sent Berry!");

			await mintTo(
				connection,
				payer,
				new PublicKey(MINT_ADDRESS),
				associatedTokenAccount.address,
				new PublicKey(STAKING_ADDRESS),
				lstTokenAmount * 10 ** decimals,
				[],
				null,
				TOKEN_2022_PROGRAM_ID
			);
		} catch (error) {
			console.log("Error while Staking :", error);
		}
	};

	const withdrawSol = async () => {
		try {
			if (!wallet.publicKey) {
				alert("Please connect your wallet first");
				return;
			}

			if (!unStakeAmount) {
				alert("Please enter a valid unstaking amount");
				return;
			}

			const decimals = 9;
			const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
				connection,
				payer,
				new PublicKey(MINT_ADDRESS),
				wallet.publicKey,
				true,
				null,
				null,
				TOKEN_2022_PROGRAM_ID,
				ASSOCIATED_TOKEN_PROGRAM_ID
			);

			const burnTx = new Transaction().add(
				createBurnInstruction(
					associatedTokenAccount.address,
					new PublicKey(MINT_ADDRESS),
					wallet.publicKey,
					unStakeAmount * 10 ** decimals,
					[],
					TOKEN_2022_PROGRAM_ID
				)
			);
			burnTx.feePayer = wallet.publicKey;
			burnTx.recentBlockhash = (
				await connection.getLatestBlockhash()
			).blockhash;
			await wallet.sendTransaction(burnTx, connection);

			const solTx = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: payer.publicKey,
					toPubkey: wallet.publicKey,
					lamports: unStakeAmount * LAMPORTS_PER_SOL,
				})
			);
			solTx.feePayer = payer.publicKey;
			solTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
			await sendAndConfirmTransaction(connection, solTx, [payer]);

			alert("Unstaked and sent SOL!");
		} catch (error) {
			console.error("Error while unstaking:", error);
			alert("Error while unstaking: " + error.message);
		}
	};

	return (
		<>
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
				<h1>Liquid Staked Solana </h1>
				<div className="stake-unstake-container">
					<div className="stake-unstake-section">
						{/* Stake Section */}
						<div style={{ display: "flex", gap: "5px" }}>
							<input
								className="inputText"
								type="text"
								placeholder="Amount"
								onChange={(e) => {
									setAmount(Number(e.target.value));
									setLSTAmount(e.target.value);
								}}
							/>
							<img
								src="https://img.icons8.com/?size=100&id=icTiMgoOHSVy&format=png&color=000000"
								alt="solana"
								height={60}
								width={60}
							/>
						</div>
						<br />
						<div style={{ display: "flex", gap: "5px" }}>
							<input
								className="inputText"
								type="text"
								placeholder="ZoroBerry"
								value={lst}
								readOnly
							/>
							<img
								src="https://prasadware.vercel.app/pfp.JPG"
								alt="zoroberry"
								height={50}
								width={50}
								style={{
									border: "2px solid #fff",
									borderRadius: "50%",
									marginLeft: "5px",
								}}
							/>
						</div>
						<br />
						<button className="btn" onClick={stakeSol}>
							Stake SOL
						</button>
					</div>
					<div className="stake-unstake-section">
						{/* Unstake Section */}
						<div style={{ display: "flex", gap: "5px" }}>
							<input
								className="inputText"
								type="text"
								placeholder="ZoroBerry"
								onChange={(e) => {
									setUnstakeAmount(Number(e.target.value));
									setSolAmount(e.target.value);
								}}
							/>
							<img
								src="https://prasadware.vercel.app/pfp.JPG"
								alt="zoroberry"
								height={50}
								width={50}
								style={{
									border: "2px solid #fff",
									borderRadius: "50%",
									marginLeft: "5px",
								}}
							/>
						</div>
						<br />
						<div style={{ display: "flex", gap: "5px" }}>
							<input
								className="inputText"
								type="text"
								placeholder="SOL"
								value={unstakeSol}
								readOnly
							/>

							<br />
							<img
								src="https://img.icons8.com/?size=100&id=icTiMgoOHSVy&format=png&color=000000"
								alt="solana"
								height={60}
								width={60}
							/>
						</div>
						<br />
						<button className="btn" onClick={withdrawSol}>
							UnStake SOL
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Stake;
