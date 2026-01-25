const elements = document.getElementsByClassName('team-division');

function handleScroll() {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const visibilityThreshold = vw > 768 ? 0.5 : 0.3;
    const styles = window.getComputedStyle(elements[0]);
    const stickyThreshold = parseFloat(styles.top);

    const elementsArray = Array.from(elements);

    elementsArray.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const elementHeight = el.offsetHeight;
        const triggerPoint = vh - (elementHeight * visibilityThreshold);

        if (rect.top < triggerPoint) {
            el.style.opacity = "1";
        } else {
            el.style.opacity = "0";
        }
        const nextEl = elementsArray[index + 1];
        if (nextEl) {
            const nextRect = nextEl.getBoundingClientRect();
            if (nextRect.top <= stickyThreshold + 2) {
                el.style.opacity = "0";
            }
        }
    });
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);

const cards = document.querySelectorAll('.people-card');

cards.forEach(card => {
    card.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            this.classList.toggle('is-tapped');
            cards.forEach(c => { if (c !== this) c.classList.remove('is-tapped'); });
        }
    });
});