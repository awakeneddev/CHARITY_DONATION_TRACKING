// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// OpenZepplin' IERC20 interface
interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

contract Donation {
    // Struct to store donation details
    struct DonationDetail {
        uint256 campaignId;
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    struct Campaign {
        uint256 id;
        string title;
        string description;
        string organization;
        uint256 targetAmount;
        uint256 raisedAmount;
        address beneficiary;
        address owner;
        bool isActive;
        uint256 createdAt;
    }

    // Mappings for campaigns and donations to store
    mapping(uint256 => Campaign) public campaigns;
    mapping(address => DonationDetail[]) public donorHistory;

    // counting campaign
    uint256 public campaignCounter;

    // ERC20 Token to be used for donations
    IERC20 public donationToken;

    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 targetAmount,
        uint256 timestamp
    );

    event DonationReceived(
        address indexed donor,
        uint256 indexed campaignId,
        uint256 addmod,
        uint256 timestamp
    );

    event FundsWithdrawn(
        uint256 indexed campaignId,
        uint256 amount,
        uint256 timestamp
    );

    // Constructor to set the ERC20 token address
    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        donationToken = IERC20(_tokenAddress);
    }

    // Create a new campaign
    function createCampaign(
        string calldata _title,
        string calldata _description,
        uint256 _targetAmount,
        string calldata _organization,
        address _beneficiary
    ) external {
        require(_targetAmount > 0, "Target amount must be greater than zero");
        require(_beneficiary != address(0), "Invalid beneficiary address");

        campaignCounter++;
        campaigns[campaignCounter] = Campaign({
            id: campaignCounter,
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            organization:_organization,
            beneficiary: _beneficiary,
            owner: msg.sender,
            isActive: true,
            createdAt: block.timestamp
        });

        emit CampaignCreated(
            campaignCounter,
            msg.sender,
            _targetAmount,
            block.timestamp
        );
    }

    // Donate to a campaign using ERC20 tokens
    function donateToCampaign(uint256 _campaignId, uint256 _amount) external {
        require(_amount > 0, "Donation amount must be greater than zero");
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active");

        // Transfer tokens from donor to the contract
        require(
            donationToken.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );

        campaign.raisedAmount += _amount;

        // Store donor details
        donorHistory[msg.sender].push(
            DonationDetail({
                campaignId: _campaignId,
                donor: msg.sender,
                amount: _amount,
                timestamp: block.timestamp
            })
        );

        emit DonationReceived(
            msg.sender,
            _campaignId,
            _amount,
            block.timestamp
        );
    }

    // Withdraw funds from a campaign in ERC20 tokens
    function withdrawFunds(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        // Only the campaign owner can withdraw funds
        require(
            msg.sender == campaign.owner,
            "Only the owner can withdraw funds"
        );

        // Check if there are funds available to withdraw
        require(campaign.raisedAmount > 0, "No funds available to withdraw");

        // Ensure the beneficiary address is valid
        require(
            campaign.beneficiary != address(0),
            "Invalid beneficiary address"
        );

        uint256 amount = campaign.raisedAmount;
        campaign.raisedAmount = 0;

        // Transfer funds in ERC20 tokens
        require(
            donationToken.transfer(campaign.beneficiary, amount),
            "Token transfer failed"
        );

        // Emit an event for transparency
        emit FundsWithdrawn(_campaignId, amount, block.timestamp);
    }

    // Get donation history for a donor
    function getDonationHistory(
        address _donor
    ) external view returns (DonationDetail[] memory) {
        return donorHistory[_donor];
    }
}
