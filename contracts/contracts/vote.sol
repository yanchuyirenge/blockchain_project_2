// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./MyERC20.sol";

contract vote {

    uint256 constant public START_AMOUNT = 1000;
    uint256 constant public VOTE_AMOUNT = 500;
    uint256 constant public REWARD_AMOUNT = START_AMOUNT + VOTE_AMOUNT;
    uint constant public TIME_DELAY=60;

    struct Proposal {
        address starter;
        string des;
        uint numf;
        uint numo;
        uint pass;
        uint time;
        address[] favor;
        address[] oppose;
    }
    Proposal[] public proposals;

    MyERC20 public myERC20; 

    constructor() {
        myERC20 = new MyERC20("ZJUToken", "ZJUTokenSymbol");
    }

    function canvote(address a,uint num) public view returns (bool) {
        uint i;
        if(proposals[num].time+TIME_DELAY<block.timestamp) return false;
        for(i=0;i<proposals[num].favor.length;i++){
            if(proposals[num].favor[i]==a) return false;
        }
        for(i=0;i<proposals[num].oppose.length;i++){
            if(proposals[num].oppose[i]==a) return false;
        }
        return true;
    }

    function start(string memory des) public {
        myERC20.transferFrom(msg.sender, address(this), START_AMOUNT);
        Proposal memory p;
        p.starter=msg.sender;
        p.numf=0;
        p.numo=0;
        p.des=des;
        p.pass=0;
        p.time=block.timestamp;
        proposals.push(p);
    }

    function p_favor(uint num) public {
        require(canvote(msg.sender,num)==true,"You cannot vote this proposal");
        // 委托转账操作
        myERC20.transferFrom(msg.sender, address(this), VOTE_AMOUNT);
        
        proposals[num].numf+=1;
        proposals[num].favor.push(msg.sender);
    }

    function p_oppose(uint num) public {
        require(canvote(msg.sender,num)==true,"You cannot vote this proposal");
        // 委托转账操作
        myERC20.transferFrom(msg.sender, address(this), VOTE_AMOUNT);
        
        proposals[num].numo+=1;
        proposals[num].oppose.push(msg.sender);
    }

    function refresh() public{
        uint i;
        for(i=0;i<proposals.length;i++){
            if(proposals[i].pass!=0||proposals[i].time+TIME_DELAY>=block.timestamp){
                continue;
            } 
            else if(proposals[i].numf>proposals[i].numo) {
                myERC20.transfer(proposals[i].starter, REWARD_AMOUNT);
                proposals[i].pass=1;
            }
            else if(proposals[i].numf<=proposals[i].numo) {
                proposals[i].pass=2;
            }
        }
    }

    function get() public returns(Proposal[] memory){
        return proposals;
    }
}
