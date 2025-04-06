import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function TokenLaunchpad() {


    const createToken = async () =>{
      
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
