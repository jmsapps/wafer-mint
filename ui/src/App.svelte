<script lang="ts">
	import { wallet, connectWallet, mintNFT } from "stores";

	const IS_DEV = process.env.ROLLUP_ENV === "development";

	export let title;
	let _selectedChain: string = IS_DEV ? "0xaa36a7" : "0x1";
	let _wallet: IWallet;
	let metadataURI = "";
	let amount = 1;

  wallet.subscribe(value => _wallet = value);

	const getChainOptions = (isDev: boolean): SelectOption[] => {
		return isDev
		? [
			{ label: "Ethereum (Sepolia Testnet)", value: "0xaa36a7" },
			{ label: "Polygon (Amoy Testnet)", value: "0x13882" },
		]
		: [
			{ label: "Ethereum", value: "0x1" },
			{ label: "Polygon", value: "0x89" },
		];
	}

	const handleConnectWallet = async () => {
		await connectWallet(_selectedChain)
	}

	const handleMintNFT = async () => {
		await mintNFT(
			_wallet?.address!,
			amount,
			metadataURI,
		)
	}
</script>

<main>
	<div class="main-container">
		<h1>{title}</h1>
		<p>Mint your own NFT by following these steps:</p>
		<p>1. Connect to MetaMask</p>
		<p>2. Enter the Metadata URI and the number of NFT's you want to mint</p>
		{#if !_wallet?.address}
			<button on:click={handleConnectWallet}>Connect MetaMask</button>
		{/if}

		{#if _wallet?.address}
			<div class="select-container-outer">
				<div class="select-container">
					<label for="metamask-chains">Select chain</label>

					<select
						id="metamask-chains"
						name="metamask-chains"
						bind:value={_selectedChain}
						on:change={handleConnectWallet}
					>
					{#each getChainOptions(IS_DEV) as option}
						<option value={option.value}>{option.label}</option>
					{/each}
					</select>
				</div>
			</div>

			<p>Address: {_wallet.address}</p>
			<p>Network Chain ID: {_wallet.network?.chainId}</p>
			<p>Balance: {_wallet.balance}</p>

			<div class="mint-container">
				<label for="metadata-uri">Metadata URI</label>
				<input type="text" id="metadata-uri" bind:value={metadataURI} placeholder="https://your-metadata-uri.com/1.json" />

				<label for="amount">Amount</label>
				<input type="number" id="amount" bind:value={amount} min="1" />

				<button
					style={!metadataURI ? "opacity: 0.5;" : ""}
					disabled={!metadataURI}
					on:click={handleMintNFT}>Mint NFT
				</button>
			</div>
		{/if}
	</div>
</main>

<style>
	main {
		position: absolute;
		text-align: center;
		padding: 24px;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		color: #fbfbfb;
		background-color: rgb(0, 0, 0);
	}

	.main-container {
		background-color: transparent;
		height: 100%;
		width: 100%;
		overflow: auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.select-container-outer {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.select-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		width: 270px;
	}

	.select-container label {
		font-weight: 500;
		margin-bottom: 8px;
	}

	.mint-container {
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.mint-container input {
		padding: 8px;
		font-size: 1rem;
		width: 300px;
	}

	.mint-container button {
		background-color: #ff3e00;
		color: white;
		border: none;
		padding: 10px 20px;
		cursor: pointer;
		font-size: 1rem;
	}

	@media (min-width: 640px) {
		main {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
</style>
