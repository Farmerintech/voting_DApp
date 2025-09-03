let provider, signer, contract;

const contractAddress = "0x82c9f44cd15Ebef06E56441B7782e7E85CF84A8f";
// const contractABI = [ /* Paste ABI JSON here */ ];

const connectBtns = document.querySelectorAll("#connectBTN");
const container = document.getElementById("candidateList");
const voteBTN = document.getElementById("voteBTN");
const walletDisplay = document.getElementById("walletAddress");

const dappLink = "https://voting-d-app-pearl.vercel.app"; 
const metamaskDeepLink = `https://metamask.app.link/dapp/${encodeURIComponent(dappLink)}`;
const playStoreLink = "https://play.google.com/store/apps/details?id=io.metamask";
const appStoreLink = "https://apps.apple.com/app/metamask-blockchain-wallet/id1438144202";

function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /Android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent);
}

async function connectWallet() {
  if (isMobileDevice()) {
    // Try to open MetaMask mobile app
    window.location.href = metamaskDeepLink;

    // Fallback: if not installed, redirect to app stores
    setTimeout(() => {
      if (/Android/i.test(navigator.userAgent)) {
        window.location.href = playStoreLink;
      } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = appStoreLink;
      }
    }, 3000);
    return;
  }

  // Desktop users
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    alert("Please install MetaMask extension to continue.");
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum); // ethers v6
    signer = await provider.getSigner();

    const addr = await signer.getAddress();
    const shortAddr = addr.slice(0, 6) + "..." + addr.slice(-4);

    walletDisplay.innerText = "Connected: " + addr;
    connectBtns.forEach(b => b.innerText = "Connected: " + shortAddr);

    contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log("Contract connected:", contract);
  } catch (err) {
    console.error("Error connecting to MetaMask:", err);
  }
}

connectBtns.forEach(btn => {
  btn.onclick = connectWallet;
});

voteBTN.addEventListener("click", initVote);

async function initVote() {
  if (!contract) {
    alert("Please connect your wallet first!");
    return;
  }
  container.style.display = "flex"; 
  getCandidate();
}

async function getCandidate() {
  try {
    if (!contract) {
      alert("Contract not connected yet!");
      return;
    }

    const candidates = await contract.getAllCandidates();
    console.log(candidates);

    container.innerHTML = "";
    container.className = "";
    container.classList.add(
      "fixed", "inset-0", "z-50", "bg-black", "bg-opacity-90",
      "text-white", "p-4", "md:p-10",
      "flex", "flex-wrap", "justify-center", "items-center", "gap-6",
      "overflow-auto"
    );

    const closeButton = document.createElement("div");
    closeButton.textContent = "Close ✖";
    closeButton.className = "close absolute top-4 right-4 text-white bg-pink-700 hover:bg-pink-800 px-4 py-2 rounded-md z-50";
    closeButton.onclick = () => {
      container.style.display = "none"; 
    };
    container.appendChild(closeButton);

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

window.vote = async (id) => {
  try {
    const castVote = await contract.castVote(id);
    console.log("Vote cast:", castVote);
  } catch (error) {
    console.log(error);
    alert("You have already voted.");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const text = "Welcome to web3 Voting system";
  const typingSpeed = 100;
  const element = document.getElementById("typing-text");
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, typingSpeed);
    }
  }

  typeWriter();
});
