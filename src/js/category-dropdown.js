let isIndexPage = false;


// Add event listener to dropdown
function addDropdownListener(dropdown) {
    // Dropdown
    dropdown.querySelector(".category-dropdown").addEventListener("click", function(e) {
        const compPath = e.composedPath();
        for(let i = 0; i < compPath.length; i++) {
            if(compPath[i].classList.contains("category-dropdown"))  {
                const dropdownArrowDOM = compPath[i].querySelector(".dropdown-arrow");
                const dropdownContent = compPath[i].parentNode.querySelector(".dropdown-content");

                if(!compPath[i].classList.contains("turned")) {
                    compPath[i].classList.add("turned");
                    

                    anime({
                        targets: dropdownArrowDOM,
                        rotate: '90deg',
                        duration: 500
                    });

                    anime({
                        targets: dropdownContent,
                        height: (9 * dropdownContent.children.length) + "rem",
                        duration: 500,
                        easing: "easeInOutExpo"
                    });

                    setTimeout(function() { dropdownContent.classList.add("applied-transition") }, 500);
                } else {
                    compPath[i].classList.remove("turned");
                    dropdownContent.classList.remove("applied-transition");

                    anime({
                        targets: dropdownArrowDOM,
                        rotate: '0deg',
                        duration: 500
                    });

                    anime({
                        targets: dropdownContent,
                        height: '0rem',
                        duration: 500,
                        easing: "easeInOutExpo"
                    });
                }

                break;
            }
        }
    });
}

// Swiping
const dropdownContainerDOM = document.querySelector(".dropdown-container");

let startPosX = 0;
let startPosY = 0;
let trackedPath = [];

dropdownContainerDOM.addEventListener("touchstart", function(e) {
    startPosX = e.touches[0].screenX;
    startPosY = e.touches[0].screenY;
    trackedPath = e.path;
}, true);

dropdownContainerDOM.addEventListener("touchmove", function(e) {
    // Left swipe
    if(startPosX - 20 > e.touches[0].screenX && e.touches[0].screenY >= startPosY - 50 && e.touches[0].screenY <= startPosY + 50) {
        for(let i = 0; i < trackedPath.length; i++) {
            if(trackedPath[i].classList != undefined && trackedPath[i].classList.contains("news-item")) {
                trackedPath[i].style.transform = "translateX(-9rem)";
                break;
            }
        }
    }
    // Right swipe
    else if(startPosX + 20 < e.touches[0].screenX && e.touches[0].screenY >= startPosY - 50 && e.touches[0].screenY <= startPosY + 50) {
        for(let i = 0; i < trackedPath.length; i++) {
            if(trackedPath[i].classList != undefined && trackedPath[i].classList.contains("news-item")) {
                trackedPath[i].style.transform = "translateX(0)";
                break;
            }
        }
    }
    // Down swipe (refresh)
    else if(isIndexPage && startPosY + 100 < e.touches[0].screenY && e.touches[0].screenX >= startPosX - 50 && e.touches[0].screenX <= startPosX + 50) {
        if(dropdownContainerDOM.scrollTop <= 2) {
            dropdownContainerDOM.style.overflow = "hidden";
            document.querySelector(".refresh-block").classList.add("visible");
            document.body.classList.add("refreshing");

            refreshNews();
        }
    }
}, true);