import "./App.css";
import { TokenLaunchpad } from "./components/TokenLaunchpad";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useState } from "react";
import MintToken from "./components/MintToken";

function App() {
	const [tab, setTab] = useState(0);
	return (
		<ConnectionProvider endpoint="https://api.devnet.solana.com">
			<WalletProvider wallets={[]} autoConnect>
				<WalletModalProvider>
					{tab === 0 && (
						<div>
							<h1>SOLANA TOKEN DAPP</h1>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									gap: "5px",
								}}
							>
								<button onClick={() => setTab(1)}>LAUNCH TOKEN</button>
								<button onClick={() => setTab(2)}>MINT TOKENS</button>
							</div>
						</div>
					)}
					{tab === 1 && (
						<div
							style={{
								paddingTop: "30px",
							}}
						>
							<button onClick={() => setTab(0)}>HOME</button>
							<TokenLaunchpad />
						</div>
					)}
					{tab === 2 && (
						<div
							style={{
								paddingTop: "30px",
							}}
						>
							<button onClick={() => setTab(0)}>HOME</button>
							<MintToken />
						</div>
					)}
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}

export default App;
