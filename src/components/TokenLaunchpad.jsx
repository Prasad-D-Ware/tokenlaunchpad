import {
	WalletDisconnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
	createAssociatedTokenAccountInstruction,
	createInitializeInstruction,
	createInitializeMetadataPointerInstruction,
	createInitializeMintInstruction,
	createMintToInstruction,
	ExtensionType,
	getAssociatedTokenAddressSync,
	getMintLen,
	LENGTH_SIZE,
	TOKEN_2022_PROGRAM_ID,
	TYPE_SIZE,
} from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { pack } from "@solana/spl-token-metadata";

export function TokenLaunchpad() {
	const [name, setName] = useState("");
	const [symbol, setSymbol] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [supply, setSupply] = useState(0);
	const [decimals, setDecimals] = useState(9);
	const { connection } = useConnection();
	const wallet = useWallet();

	const createToken = async () => {
		// console.log(name , symbol , imageUrl , decimals, supply);
		try {
			const mintAccount = Keypair.generate();

			const metaData = {
				mint: mintAccount.publicKey,
				name,
				symbol,
				uri: imageUrl,
				additionalMetadata: [],
			};

			const mintLen = getMintLen([ExtensionType.MetadataPointer]);
			const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metaData).length;

			const lamports = await connection.getMinimumBalanceForRentExemption(
				mintLen + metadataLen
			);

			const transaction = new Transaction().add(
				SystemProgram.createAccount({
					fromPubkey: wallet.publicKey,
					newAccountPubkey: mintAccount.publicKey,
					space: mintLen,
					lamports,
					programId: TOKEN_2022_PROGRAM_ID,
				}),
				// createInitializeMint2Instruction(mintAccount.publicKey, 5, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID),
				createInitializeMetadataPointerInstruction(
					mintAccount.publicKey,
					wallet.publicKey,
					mintAccount.publicKey,
					TOKEN_2022_PROGRAM_ID
				),
				createInitializeMintInstruction(
					mintAccount.publicKey,
					decimals,
					wallet.publicKey,
					wallet.publicKey,
					TOKEN_2022_PROGRAM_ID
				),
				createInitializeInstruction({
					programId: TOKEN_2022_PROGRAM_ID,
					mint: mintAccount.publicKey,
					metadata: mintAccount.publicKey,
					name: metaData.name,
					symbol: metaData.symbol,
					uri: metaData.uri,
					updateAuthority: wallet.publicKey,
					mintAuthority: wallet.publicKey,
				})
			);

			const latestBlockhash = await connection.getLatestBlockhash();
			transaction.recentBlockhash = latestBlockhash.blockhash;
			transaction.feePayer = wallet.publicKey;

			transaction.partialSign(mintAccount);

			await wallet.sendTransaction(transaction, connection);
			alert(`Mint Account Created : ${mintAccount.publicKey.toBase58()}`);

			const associatedAccount = getAssociatedTokenAddressSync(
				mintAccount.publicKey,
				wallet.publicKey,
				false,
				TOKEN_2022_PROGRAM_ID
			);

			console.log("Associated Token Account ", associatedAccount.toBase58());

			const transaction2 = new Transaction().add(
				createAssociatedTokenAccountInstruction(
					wallet.publicKey,
					associatedAccount,
					wallet.publicKey,
					mintAccount.publicKey,
					TOKEN_2022_PROGRAM_ID
				)
			);

			await wallet.sendTransaction(transaction2, connection);

			const transaction3 = new Transaction().add(
				createMintToInstruction(
					mintAccount.publicKey,
					associatedAccount,
					wallet.publicKey,
					supply * 10 ** decimals,
					[],
					TOKEN_2022_PROGRAM_ID
				)
			);

			await wallet.sendTransaction(transaction3, connection);

			alert(
				`Minted ${supply} tokens of ${symbol} for ${wallet.publicKey.toBase58()}`
			);
            setName("");
            setSymbol("");
            setSupply(0);
            setDecimals(9);
            setImageUrl("");
		} catch (e) {
			alert("Error while creating and minting token : " + e.message);
			console.log("Error : ", e.message);
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
			<h1>Solana Token Launchpad</h1>
			<input
				className="inputText"
				type="text"
				placeholder="Name"
				onChange={(e) => setName(e.target.value)}
			></input>{" "}
			<br />
			<input
				className="inputText"
				type="text"
				placeholder="Symbol"
				onChange={(e) => setSymbol(e.target.value)}
			></input>{" "}
			<br />
			<input
				className="inputText"
				type="text"
				placeholder="MetaData URL"
				onChange={(e) => setImageUrl(e.target.value)}
			></input>{" "}
			<br />
			<input
				className="inputText"
				type="text"
				placeholder="Decimals"
				onChange={(e) => setDecimals(e.target.value)}
			></input>{" "}
			<br />
			<input
				className="inputText"
				type="text"
				placeholder="Initial Supply"
				onChange={(e) => setSupply(e.target.value)}
			></input>{" "}
			<br />
			<button className="btn" onClick={createToken}>
				Create a token
			</button>
		</div>
	);
}
