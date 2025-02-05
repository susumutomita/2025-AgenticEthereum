// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/CryptoDailyBrief.sol";

contract MockOLAS is ERC20 {
    constructor() ERC20("Mock OLAS", "OLAS") {
        _mint(msg.sender, 1000000 ether);
    }
}

contract CryptoDailyBriefTest is Test {
    CryptoDailyBrief public cryptoDailyBrief;
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
        cryptoDailyBrief = new CryptoDailyBrief(address(olas));

        // エージェントに OLAS トークンを送付
        vm.deal(agent, 100 ether);
        olas.transfer(agent, 1000 ether);
    }

    function testRegisterService() public {
        string memory name = "Test Service";
        string memory description = "Test Description";

        vm.expectEmit(true, true, false, true);
        emit ServiceRegistered(1, name, description);

        uint256 serviceId = cryptoDailyBrief.registerService(name, description);
        assertEq(serviceId, 1);

        (string memory registeredName, string memory registeredDesc, bool active) =
            cryptoDailyBrief.getService(serviceId);
        assertEq(registeredName, name);
        assertEq(registeredDesc, description);
        assertTrue(active);
    }

    function testRegisterAgent() public {
        // まずサービスを登録
        uint256 serviceId = cryptoDailyBrief.registerService("Test Service", "Test Description");

        // エージェントが OLAS トークンをステーク
        vm.startPrank(agent);
        olas.approve(address(cryptoDailyBrief), 100 ether);
        cryptoDailyBrief.stake(100 ether);

        vm.expectEmit(true, true, false, true);
        emit AgentRegistered(agent, serviceId);

        cryptoDailyBrief.registerAgent(serviceId);

        assertTrue(cryptoDailyBrief.isAgentRegistered(agent));
        assertEq(cryptoDailyBrief.getAgentServiceId(agent), serviceId);
        vm.stopPrank();
    }

    function testDeregisterAgent() public {
        uint256 serviceId = cryptoDailyBrief.registerService("Test Service", "Test Description");

        vm.startPrank(agent);
        olas.approve(address(cryptoDailyBrief), 100 ether);
        cryptoDailyBrief.stake(100 ether);
        cryptoDailyBrief.registerAgent(serviceId);

        vm.expectEmit(true, false, false, false);
        emit AgentDeregistered(agent);

        cryptoDailyBrief.deregisterAgent();

        bool registered = cryptoDailyBrief.isAgentRegistered(agent);
        assert(!registered);
        vm.stopPrank();
    }

    function testStaking() public {
        vm.startPrank(agent);

        olas.approve(address(cryptoDailyBrief), 150 ether);
        cryptoDailyBrief.stake(100 ether);
        assertEq(cryptoDailyBrief.getStake(agent), 100 ether);

        cryptoDailyBrief.stake(50 ether);
        assertEq(cryptoDailyBrief.getStake(agent), 150 ether);

        cryptoDailyBrief.unstake(50 ether);
        assertEq(cryptoDailyBrief.getStake(agent), 100 ether);

        vm.stopPrank();
    }

    function test_RevertWhen_UnauthorizedServiceRegistration() public {
        vm.prank(agent);
        vm.expectRevert("Unauthorized");
        cryptoDailyBrief.registerService("Test Service", "Test Description");
    }

    function testInsufficientStakeReverts() public {
        uint256 serviceId = cryptoDailyBrief.registerService("Test Service", "Test Description");

        vm.startPrank(agent);
        olas.approve(address(cryptoDailyBrief), 50 ether);
        cryptoDailyBrief.stake(50 ether); // MIN_STAKE 未満

        vm.expectRevert("Insufficient stake");
        cryptoDailyBrief.registerAgent(serviceId);
        vm.stopPrank();
    }

    function testUnstakeBelowMinimumReverts() public {
        uint256 serviceId = cryptoDailyBrief.registerService("Test Service", "Test Description");

        vm.startPrank(agent);
        olas.approve(address(cryptoDailyBrief), 150 ether);
        cryptoDailyBrief.stake(150 ether);
        cryptoDailyBrief.registerAgent(serviceId);

        vm.expectRevert("Cannot unstake below minimum while registered");
        cryptoDailyBrief.unstake(51 ether); // 150 - 51 = 99 ether (< MIN_STAKE)
        vm.stopPrank();
    }
}
