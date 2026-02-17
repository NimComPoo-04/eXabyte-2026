// Modal Functionality
// --- PREVIEW MODAL LOGIC --- //

// 1. Data Configuration (Edit this to change content)
const projectDetails = [
    {
        title: "Quantum Enigma",
        desc: "An in-depth look at how quantum states are revolutionizing cryptography. We explore the latest breakthroughs in qubit stability and error correction.",
        // link: "assets/x-cryptus/vol1.jpg"
    file: "assets/pdfs/vol1.pdf",
    previewImg: "assets/x-cryptus/vol1.jpg"
    },
    {
        title: "Neuro Link",
        desc: "Bridging the gap between biological neurons and silicon chips. This edition covers the ethics and engineering of brain-computer interfaces.",
        // link: "assets/x-cryptus/vol2.jpg"
        file: "assets/pdfs/vol2.pdf",
        previewImg: "assets/x-cryptus/vol2.jpg"
    },
    {
        title: "Chit Chat",
        desc: "The rise of LLMs and what it means for human communication. Is the Turing test still relevant in 2026? Find out in our exclusive report.",
        // link: "assets/x-cryptus/vol3.jpg"
        file: "assets/pdfs/vol3.pdf",
    previewImg: "assets/x-cryptus/vol3.jpg"
    },
    {
        title: "Backend Architecture",
        desc: "Scalability isn't just a buzzword. We dive deep into microservices, serverless computing, and database sharding for the modern web.",
        // link: "assets/x-cryptus/vol4.jpg"
        file: "assets/pdfs/vol4.pdf",
    previewImg: "assets/x-cryptus/vol4.jpg"
    },
    {
        title: "Game of Life",
        desc: "Simulating cellular automata to understand complex biological systems. A tribute to John Conway and the rules that govern chaos.",
        // link: "assets/x-cryptus/vol4.jpg"
        file: "assets/pdfs/vol1.pdf",
    previewImg: "assets/x-cryptus/vol1.jpg"
    }
];

const projectCards = [
    ['assets/x-cryptus/vol1.jpg', 0],
    ['assets/x-cryptus/vol2.jpg', 1],
    ['assets/x-cryptus/vol3.jpg', 2],
    ['assets/x-cryptus/vol4.jpg', 3],
    ['assets/x-cryptus/vol4.jpg', 4]
];

const modal = document.getElementById('preview-modal');
const closeBtn = document.getElementById('close-modal');

// Modal Elements to Update
const modalImg = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalLink = document.getElementById('modal-link');

// Close Modal Function
const closeModal = () => {
    modal.classList.remove('active');

    const eve = new Event("xCryptusModalClosed");
    document.body.dispatchEvent(eve);
};

closeBtn.addEventListener('click', closeModal);

// Close if clicking outside the card (on the blurred background)
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

function launchModal(imgSrc, index) {
    // Safety check to prevent errors if index is wrong
    if (!projectDetails[index]) return;

    const data = projectDetails[index];

    // Populate Modal
    // We use the image passed from the click, or fallback to data.img
    modalImg.src = imgSrc || data.img; 
    modalTitle.innerText = data.title;
    modalDesc.innerText = data.desc;

    // --- DOWNLOAD PIPELINE ---
    
    // Check if a file path exists, otherwise disable the button
    if (data.file) {
        modalLink.href = data.file;
        // Sets the filename for the user (e.g., "quantum_enigma.pdf")
        modalLink.setAttribute('download', data.title.replace(/\s+/g, '_').toLowerCase() + ".pdf");
        modalLink.style.display = 'inline-flex'; // Show button
        modalLink.innerHTML = 'DOWNLOAD <span>&nearr;</span>';
    } else {
        // Hide button if no PDF exists yet (prevents broken links)
        modalLink.style.display = 'none';
    }

    // Show Modal
    modal.classList.add('active');
}
