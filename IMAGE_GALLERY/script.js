const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let visibleItems = Array.from(galleryItems);

// 1. Category Filtering
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button state
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filterValue = btn.getAttribute("data-filter");

    galleryItems.forEach((item) => {
      const category = item.getAttribute("data-category");
      if (filterValue === "all" || category === filterValue) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });

    // Update the list of visible items for lightbox navigation
    visibleItems = Array.from(galleryItems).filter(
      (item) => !item.classList.contains("hide"),
    );
  });
});

// 2. Open Lightbox
galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    currentIndex = visibleItems.indexOf(item);
    updateLightbox();
    lightbox.classList.add("open");
  });
});

function updateLightbox() {
  const currentItem = visibleItems[currentIndex];
  const img = currentItem.querySelector("img");
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = img.alt;
}

// 3. Next & Previous Navigation
function showNext() {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  updateLightbox();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  updateLightbox();
}

nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);

// 4. Close Lightbox (Button, Outside Click, or Keyboard)
closeBtn.addEventListener("click", () => lightbox.classList.remove("open"));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("open");
  }
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") lightbox.classList.remove("open");
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});
