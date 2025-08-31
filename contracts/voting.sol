// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract VotingSystem {

    struct Candidate {
        uint256 id;
        string name;
        string username;
        uint256 votes;
        address[] voters;
    }
    
    mapping (address => bool) public hasVoted;
    
    Candidate[] public candidates;

    constructor(string[] memory _names, string[] memory _usernames) {
        require(_names.length == _usernames.length, "Input arrays must have the same length");

        for (uint i = 0; i < _names.length; i++) {
            candidates.push(Candidate({
                id: i,
                name: _names[i],
                username: _usernames[i],
                votes: 0,
                voters: new address[](0) 
            }));
        }
    }

    function castVote(uint256 id) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(id < candidates.length, "Invalid candidate ID.");

        candidates[id].votes += 1;
        candidates[id].voters.push(msg.sender);
        hasVoted[msg.sender] = true;
    }

    function getCandidateVote (uint256 id) public view returns (uint256) {
        require(id < candidates.length, "Invalid candidate ID.");
        return candidates[id].votes;
    }
    function getCandidateDetails (uint256 id) public view returns (Candidate memory){
        Candidate  memory newCandidate = Candidate({
            id:id,
            name:candidates[id].name,
            username:candidates[id].username,
            votes:candidates[id].votes,
            voters:candidates[id].voters
        });
        return newCandidate;

    }
}
