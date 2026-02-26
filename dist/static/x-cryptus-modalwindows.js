// Modal Functionality
// --- PREVIEW MODAL LOGIC --- //

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
    //FIXME: WHAT THE ACTUAL SHYTE STAIN
    document.querySelector('.cs-navbar').style.display = 'block';
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
    // Get data based on index (0 to 4)
    // Note: Your HTML has 5 cards. Make sure projectDetails array has 5 items.
    const data = projectDetails[index];

    console.log(index);

    // Populate Modal
    modalImg.src = imgSrc;
    modalTitle.innerText = data.title;
    modalDesc.innerText = data.desc;
    modalLink.href = data.link;

    // Show Modal
    modal.classList.add('active');

    // Optional: Pause horizontal scroll while reading?
    // document.body.style.overflow = 'hidden'; (Not needed since body is already hidden overflow)

   //FIXME: WHAT THE ACTUAL SHYTE STAIN 2 
    document.querySelector('.cs-navbar').style.display = 'none';

}
