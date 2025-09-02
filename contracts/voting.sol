// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract VotingSystem {
    // Struct for full candidate data (internal use)
    struct Candidate {
        uint256 id;
        string name;
        string username;
        uint256 votes;
    }

    // Lightweight struct for external/public reads (no dynamic arrays)
    struct CandidateInfo {
        uint256 id;
        string name;
        string username;
        uint256 votes;
    }

    // Array of candidates
    Candidate[] public candidates;

    // Track if an address has voted
    mapping(address => bool) public hasVoted;

    // Event to log each vote
    event VoteCast(address indexed voter, uint256 indexed candidateId);

    // Constructor to initialize candidates
    constructor(string[] memory _names, string[] memory _usernames) {
        require(_names.length == _usernames.length, "Input arrays must have the same length");

        for (uint256 i = 0; i < _names.length; i++) {
            candidates.push(Candidate({
                id: i,
                name: _names[i],
                username: _usernames[i],
                votes: 0
            }));
        }
    }

    // Function to cast a vote (one per address)
    function castVote(uint256 id) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(id < candidates.length, "Invalid candidate ID.");

        candidates[id].votes += 1;
        hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender, id); // ✅ Emit event
    }

    // Return total votes for a candidate
    function getCandidateVote(uint256 id) public view returns (uint256) {
        require(id < candidates.length, "Invalid candidate ID.");
        return candidates[id].votes;
    }

    // Return a single candidate's public details
    function getCandidateDetails(uint256 id) public view returns (CandidateInfo memory) {
        require(id < candidates.length, "Invalid candidate ID.");

        Candidate storage candidate = candidates[id];

        return CandidateInfo({
            id: candidate.id,
            name: candidate.name,
            username: candidate.username,
            votes: candidate.votes
        });
    }

    // Return all candidates
    function getAllCandidates() public view returns (CandidateInfo[] memory) {
        CandidateInfo[] memory result = new CandidateInfo[](candidates.length);
        for (uint256 i = 0; i < candidates.length; i++) {
            result[i] = CandidateInfo({
                id: candidates[i].id,
                name: candidates[i].name,
                username: candidates[i].username,
                votes: candidates[i].votes
            });
        }
        return result;
    }

    // Return candidate count (useful for frontend)
    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }
}
