// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IAutonome {
    // Events
    event AgentRegistered(address indexed agent, uint256 indexed serviceId);
    event AgentDeregistered(address indexed agent);
    event ServiceRegistered(uint256 indexed serviceId, string name, string description);

    // Agent registration
    function registerAgent(uint256 serviceId) external;
    function deregisterAgent() external;
    function isAgentRegistered(address agent) external view returns (bool);
    function getAgentServiceId(address agent) external view returns (uint256);

    // Service management
    function registerService(string memory name, string memory description) external returns (uint256);
    function getService(uint256 serviceId)
        external
        view
        returns (string memory name, string memory description, bool active);
    function getServiceCount() external view returns (uint256);

    // Stakeholding
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function getStake(address agent) external view returns (uint256);
}
