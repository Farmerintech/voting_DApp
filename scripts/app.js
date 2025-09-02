

let provider, signer, contract;

const contractAddress = "0x82c9f44cd15Ebef06E56441B7782e7E85CF84A8f";
// const contractABI = [ /* Paste ABI JSON here */ ];
const btns = document.querySelectorAll("#connectBTN");
const container = document.getElementById("candidateList");

btns.forEach(btn => {
  btn.onclick = async function () {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    // alert("Connecting to MetaMask...");
    console.log("MetaMask is installed!");

    try {
      // ✅ Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log("Signer:", signer);

      // ✅ Get wallet address
      const addr = await signer.getAddress();
      document.getElementById("walletAddress").innerText = "Connected: " + addr;
      btn.innerHTML = 'Connected &#9989;';

      // ✅ Initialize contract
      contract = new ethers.Contract(contractAddress, contractABI, signer);

      // ✅ Load candidates
      getCandidate();
  container.style.display = "flex"; // show the details again

    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
      alert("Failed to connect. See console for details.");
    }
  };
});


async function getCandidate() {
  try {
    if (!contract) {
      alert("Contract not connected yet!");
      return;
    }
const cand = await contract.getCandidateDetails(0);
    console.log(cand);

    const candidates = await contract.getAllCandidates();
    console.log(candidates);

// Clear previous content and classes
container.innerHTML = "";
container.className = ""; // Remove all old classes

// ✅ Apply layout and overlay styles (just once!)
container.classList.add(
  "fixed", "inset-0", "z-50", "bg-black", "bg-opacity-90",
  "text-white", "p-4", "md:p-10",
  "flex", "flex-wrap", "justify-center", "items-center", "gap-6",
  "overflow-auto"
);

// ✅ Add Close Button
const closeButton = document.createElement("button");
closeButton.textContent = "Close ✖";
closeButton.className = "absolute top-4 right-4 text-white bg-pink-700 hover:bg-pink-800 px-4 py-2 rounded-md z-50";
closeButton.onclick = () => {
  // container.innerHTML = "";
  container.style.display = "none"; // Hide container when closed
};
container.appendChild(closeButton);

// ✅ Render Candidate Cards
candidates.forEach(candidate => {
  const candidateDiv = document.createElement("div");

  candidateDiv.classList.add(
    "bg-black", "text-white", "rounded-xl", "shadow-lg",
    "p-4", "w-[250px]", "transition", "transform",
    "hover:-translate-y-2", "hover:shadow-2xl"
  );

  candidateDiv.innerHTML = `
    <div class="image-container overflow-hidden rounded-md mb-4">
      <img src="/assets/NFT${candidate.id}.jpg" alt="NFT Image"
        class="nft-image w-full h-[200px] object-cover transition-transform duration-500 hover:scale-110 hover:rotate-1" />
    </div>
    <div class="info space-y-2">
      <p><strong>ID:</strong> ${candidate.id}</p>
      <p><strong>Name:</strong> ${candidate.name}</p>
      <p><strong>Username:</strong> ${candidate.username}</p>
      <p><strong>Votes:</strong> ${candidate.votes}</p>
      <button onclick="vote(${candidate.id})"
        class="vote-button mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md">
        Vote
      </button>
    </div>
  `;

  container.appendChild(candidateDiv);
});

  } catch (err) {
    console.error(err);
  }
}

const vote = async (id) =>{
  try {
    const castVote = await contract.castVote(id);
    if(!castVote){
      
    }
  } catch (error) {
    console.log(error)
  }
}
