// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/Autonome.sol";

contract MockOLAS is ERC20 {
    constructor() ERC20("Mock OLAS", "OLAS") {
        _mint(msg.sender, 1000000 ether);
    }
}

contract AutonomeTest is Test {
    Autonome public autonome;
    MockOLAS public olas;
    address public owner;
    address public agent;

    event AgentRegistered(address indexed agent, uint256 indexed serviceId);
    event AgentDeregistered(address indexed agent);
    event ServiceRegistered(uint256 indexed serviceId, string name, string description);

    function setUp() public {
        owner = address(this);
        agent = address(0x1);

        olas = new MockOLAS();
        autonome = new Autonome(address(olas));

        // Fund agent with OLAS
        vm.deal(agent, 100 ether);
        olas.transfer(agent, 1000 ether);
    }

    function testRegisterService() public {
        string memory name = "Test Service";
        string memory description = "Test Description";

        vm.expectEmit(true, true, false, true);
        emit ServiceRegistered(1, name, description);

        uint256 serviceId = autonome.registerService(name, description);
        assertEq(serviceId, 1);

        (string memory registeredName, string memory registeredDesc, bool active) = autonome.getService(serviceId);
        assertEq(registeredName, name);
        assertEq(registeredDesc, description);
        assertTrue(active);
    }

    function testRegisterAgent() public {
        // Register service first
        uint256 serviceId = autonome.registerService("Test Service", "Test Description");

        // Stake OLAS tokens
        vm.startPrank(agent);
        olas.approve(address(autonome), 100 ether);
        autonome.stake(100 ether);

        vm.expectEmit(true, true, false, true);
        emit AgentRegistered(agent, serviceId);

        autonome.registerAgent(serviceId);

        assertTrue(autonome.isAgentRegistered(agent));
        assertEq(autonome.getAgentServiceId(agent), serviceId);
        vm.stopPrank();
    }

    function testDeregisterAgent() public {
        // Register service and agent first
        uint256 serviceId = autonome.registerService("Test Service", "Test Description");

        vm.startPrank(agent);
        olas.approve(address(autonome), 100 ether);
        autonome.stake(100 ether);
        autonome.registerAgent(serviceId);

        vm.expectEmit(true, false, false, false);
        emit AgentDeregistered(agent);

        autonome.deregisterAgent();

        bool registered = autonome.isAgentRegistered(agent);
        assert(!registered);
        vm.stopPrank();
    }

    function testStaking() public {
        vm.startPrank(agent);

        // Approve and stake
        olas.approve(address(autonome), 150 ether);
        autonome.stake(100 ether);
        assertEq(autonome.getStake(agent), 100 ether);

        // Add more stake
        autonome.stake(50 ether);
        assertEq(autonome.getStake(agent), 150 ether);

        // Try to unstake
        autonome.unstake(50 ether);
        assertEq(autonome.getStake(agent), 100 ether);

        vm.stopPrank();
    }

    function testFailUnauthorizedServiceRegistration() public {
        vm.prank(agent);
        autonome.registerService("Test Service", "Test Description");
    }

    function testInsufficientStakeReverts() public {
        uint256 serviceId = autonome.registerService("Test Service", "Test Description");

        vm.startPrank(agent);
        olas.approve(address(autonome), 50 ether);
        autonome.stake(50 ether); // MIN_STAKE 未満

        vm.expectRevert("Insufficient stake");
        autonome.registerAgent(serviceId);
        vm.stopPrank();
    }

    function testUnstakeBelowMinimumReverts() public {
        uint256 serviceId = autonome.registerService("Test Service", "Test Description");

        vm.startPrank(agent);
        olas.approve(address(autonome), 150 ether);
        autonome.stake(150 ether);
        autonome.registerAgent(serviceId);

        vm.expectRevert("Cannot unstake below minimum while registered");
        autonome.unstake(51 ether); // 残りが 99 OLAS となり MIN_STAKE を下回る
        vm.stopPrank();
    }
}
