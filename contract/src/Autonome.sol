// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAutonome.sol";

contract Autonome is IAutonome, Ownable {
    // OLAS token contract
    IERC20 public immutable olasToken;

    // Minimum stake required for registration
    uint256 public constant MIN_STAKE = 100 ether; // 100 OLAS

    // Structures
    struct Agent {
        uint256 serviceId;
        uint256 stakedAmount;
        bool isRegistered;
    }

    struct Service {
        string name;
        string description;
        bool active;
    }

    // State variables
    mapping(address => Agent) public agents;
    mapping(uint256 => Service) public services;
    uint256 public serviceCount;

    // コンストラクタに "Ownable(msg.sender)" を追加
    constructor(address _olasToken) Ownable(msg.sender) {
        olasToken = IERC20(_olasToken);
    }

    // Agent registration
    function registerAgent(uint256 serviceId) external override {
        require(!agents[msg.sender].isRegistered, "Agent already registered");
        require(services[serviceId].active, "Service not active");
        require(agents[msg.sender].stakedAmount >= MIN_STAKE, "Insufficient stake");

        agents[msg.sender] =
            Agent({serviceId: serviceId, stakedAmount: agents[msg.sender].stakedAmount, isRegistered: true});

        emit AgentRegistered(msg.sender, serviceId);
    }

    function deregisterAgent() external override {
        require(agents[msg.sender].isRegistered, "Agent not registered");

        delete agents[msg.sender].serviceId;
        agents[msg.sender].isRegistered = false;

        emit AgentDeregistered(msg.sender);
    }

    function isAgentRegistered(address agent) external view override returns (bool) {
        return agents[agent].isRegistered;
    }

    function getAgentServiceId(address agent) external view override returns (uint256) {
        require(agents[agent].isRegistered, "Agent not registered");
        return agents[agent].serviceId;
    }

    // Service management
    function registerService(string memory name, string memory description)
        external
        override
        onlyOwner
        returns (uint256)
    {
        serviceCount++;
        services[serviceCount] = Service({name: name, description: description, active: true});

        emit ServiceRegistered(serviceCount, name, description);
        return serviceCount;
    }

    function getService(uint256 serviceId)
        external
        view
        override
        returns (string memory name, string memory description, bool active)
    {
        Service memory service = services[serviceId];
        return (service.name, service.description, service.active);
    }

    function getServiceCount() external view override returns (uint256) {
        return serviceCount;
    }

    // Stakeholding
    function stake(uint256 amount) external override {
        require(amount > 0, "Amount must be greater than 0");
        require(olasToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        agents[msg.sender].stakedAmount += amount;
    }

    function unstake(uint256 amount) external override {
        require(amount > 0, "Amount must be greater than 0");
        require(agents[msg.sender].stakedAmount >= amount, "Insufficient stake");
        require(
            !agents[msg.sender].isRegistered || agents[msg.sender].stakedAmount - amount >= MIN_STAKE,
            "Cannot unstake below minimum while registered"
        );

        agents[msg.sender].stakedAmount -= amount;
        require(olasToken.transfer(msg.sender, amount), "Transfer failed");
    }

    function getStake(address agent) external view override returns (uint256) {
        return agents[agent].stakedAmount;
    }
}
