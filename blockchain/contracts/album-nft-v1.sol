// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";


contract AlbumNFTV1 is ERC1155URIStorage, Ownable, IERC2981 {
	uint256 public nextTokenId;
	mapping(uint256 => address) public creators;
	mapping(uint256 => uint256) public totalSupply;
	uint256 public constant ROYALTY_PERCENTAGE = 2;
	address public platformAddress;

	event NFTMinted(address indexed creator, uint256 tokenId, uint256 amount, string tokenURI);

	constructor(string memory baseURI, address _platformAddress) ERC1155(baseURI) Ownable(msg.sender) {
		platformAddress = _platformAddress;
	}

	function mintNFT(uint256 amount, string memory metadataURI) public {
		require(amount > 0, "Must mint at least 1 copy");

		uint256 tokenId = nextTokenId;
		nextTokenId++;

		_mint(msg.sender, tokenId, amount, "");
		_setURI(tokenId, metadataURI);
		creators[tokenId] = msg.sender;
		totalSupply[tokenId] = amount;

		emit NFTMinted(msg.sender, tokenId, amount, metadataURI);
	}

	function royaltyInfo(uint256 /* tokenId */, uint256 salePrice) external view override returns (address receiver, uint256 royaltyAmount) {
		uint256 totalRoyalty = (salePrice * ROYALTY_PERCENTAGE) / 100; // 2% of sale price

		return (platformAddress, totalRoyalty);
	}
}
