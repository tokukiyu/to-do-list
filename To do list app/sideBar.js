const sidebar = document.querySelector(".left-section");
const sideBar = {
  addVisibleClass: () => {
    //overlay.classList.remove("overlay");
    sidebar.style.display = "block";
  },
  removeVisibleClass: () => {
    sidebar.style.display = "none";
  },
  controlSidebarVisibility: () => {
    window.innerWidth > 750 && sideBar.addVisibleClass();
    window.innerWidth < 750 && sideBar.removeVisibleClass();

    window.addEventListener("resize", () => {
      if (window.innerWidth < 750) {
        sideBar.removeVisibleClass();
      } else {
        sideBar.addVisibleClass();
      }
    });
  },
};

export { sideBar };
