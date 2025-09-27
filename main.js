import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js';

const connectBtn = document.getElementById('connectBtn');
const gmBtn = document.getElementById('gmBtn');
const disconnectBtn = document.getElementById('disconnectBtn');

const gmAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "GMed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getLastGm",
		"outputs": [
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gm",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastGmTimestamp",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastMessage",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const gmContractAddress = "0xYourGMContractAddressHere";

let walletAddress = localStorage.getItem('walletAddress');

if (walletAddress) {
  connectBtn.textContent = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  gmBtn.disabled = false;
  disconnectBtn.style.display = 'inline-block';
}

async function connectWallet() {
  if (!window.ethereum) {
    alert('🦊 MetaMask not detected. Please install it.');
    return;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x20d8',
        chainName: 'ZenChain Testnet',
        nativeCurrency: {
          name: 'ZenChain Token',
          symbol: 'ZTC',
          decimals: 18
        },
        rpcUrls: ['https://zenchain-testnet.api.onfinality.io/public']
      }]
    });

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    walletAddress = accounts[0];

    localStorage.setItem('walletAddress', walletAddress);
    connectBtn.textContent = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    gmBtn.disabled = false;
    disconnectBtn.style.display = 'inline-block';
  } catch (error) {
    console.error('Connection failed:', error);
    alert('❌ Wallet connection failed.');
  }
}

function disconnectWallet() {
  walletAddress = null;
  localStorage.removeItem('walletAddress');

  connectBtn.textContent = '🦊 Connect Wallet';
  gmBtn.disabled = true;
  disconnectBtn.style.display = 'none';

  alert('Wallet disconnected. Please reconnect to continue.');
}

async function sendGm() {
  if (!walletAddress) {
    await connectWallet();
    if (!walletAddress) return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gmContract = new ethers.Contract(gmContractAddress, gmAbi, signer);

    const lastGmDay = await gmContract.lastGmTimestamp(walletAddress);
    const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

    if (lastGmDay.toNumber() >= today) {
      alert("🌙 You’ve already GMed today. Come back tomorrow!");
      return;
    }

    const tx = await gmContract.gm();
    await tx.wait();

    alert("✅ GM registered on-chain. Have a great day!");
  } catch (err) {
    console.error("GM failed:", err);
    alert("Coming Soon.");
  }
}

connectBtn.addEventListener('click', connectWallet);
disconnectBtn.addEventListener('click', disconnectWallet);
gmBtn.addEventListener('click', sendGm);
