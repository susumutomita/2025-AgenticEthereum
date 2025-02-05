// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IServiceRegistry {
    function register(address agent, uint256 serviceId) external;
    function isRegistered(address agent, uint256 serviceId) external view returns (bool);
}

contract CryptoDailyBriefIntegration is Ownable {
    IServiceRegistry public serviceRegistry;
    IERC20 public olasToken;

    mapping(address => bool) public registeredAgents;
    mapping(address => uint256) public agentServiceIds;

    event AgentRegistered(address indexed agent, uint256 serviceId);
    event ServiceRegistryUpdated(address indexed newRegistry);

    constructor(address _serviceRegistry, address _olasToken) Ownable(msg.sender) {
        serviceRegistry = IServiceRegistry(_serviceRegistry);
        olasToken = IERC20(_olasToken);
    }

    function registerAgent(uint256 serviceId) external {
        require(!registeredAgents[msg.sender], "Agent already registered");
        require(olasToken.balanceOf(msg.sender) >= 100 ether, "Insufficient OLAS tokens");

        serviceRegistry.register(msg.sender, serviceId);
        registeredAgents[msg.sender] = true;
        agentServiceIds[msg.sender] = serviceId;

        emit AgentRegistered(msg.sender, serviceId);
    }

    function updateServiceRegistry(address _newRegistry) external onlyOwner {
        serviceRegistry = IServiceRegistry(_newRegistry);
        emit ServiceRegistryUpdated(_newRegistry);
    }

    function isAgentRegistered(address agent) external view returns (bool) {
        return registeredAgents[agent];
    }

    function getAgentServiceId(address agent) external view returns (uint256) {
        require(registeredAgents[agent], "Agent not registered");
        return agentServiceIds[agent];
    }
}
