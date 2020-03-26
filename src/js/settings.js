// Category order
let categoryOrder = [
    "Europe",
    "Business",
    "Health",
    "Travel",
    "Sports",
];
if(localStorage.getItem("category-order") != undefined) categoryOrder = JSON.parse(localStorage.getItem("category-order"));


// Toggle buttons
const togglesDOM = document.querySelectorAll(".option-checkbox");

togglesDOM.forEach(function(e) {
    // Set value based on saved data
    if(localStorage.getItem(e.id) == "true") {
        e.click();
    } else if(!localStorage.getItem(e.id)) {
        localStorage.setItem(e.id, "true");
        e.click();
    }

    // Change category order
    e.parentNode.classList.add("order-" + categoryOrder.indexOf(e.parentNode.querySelector(".card-title").innerHTML));


    e.addEventListener("change", function(e) {
        localStorage.setItem(e.target.id, e.target.checked);
    });
});


// Dark mode
const darkModeBtnDOM = document.querySelector(".dark-mode-button");

darkModeBtnDOM.addEventListener("click", function() {
    if(document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("dark-mode", "false");
    } else {
        document.body.classList.add("dark-mode");
        localStorage.setItem("dark-mode", "true");
    }
});

// Move options around
const settingsContainerDOM = document.querySelector(".settings-container");

let offsetPosY = 0;
let trackedElement = null;

settingsContainerDOM.addEventListener("touchstart", function(e) {
    const compPath = e.composedPath();
    for(let i = 0; i < compPath.length; i++) {
        if(compPath[i].classList.contains("option-wrapper")) {
            trackedElement = compPath[i];
            offsetPosY = compPath[i].offsetTop + (e.touches[0].clientY - compPath[i].offsetTop);

            compPath[i].classList.add("z-10");
            document.body.classList.add("dragging");
            break;
        }
    }
}, true);

settingsContainerDOM.addEventListener("touchmove", function(e) {
    if(trackedElement != null) trackedElement.style.top = -(offsetPosY - e.touches[0].clientY) + "px";
}, true);

settingsContainerDOM.addEventListener("touchend", function(e) {
    if(trackedElement != null) {
        // Snap element back in place

        
        // Reset values
        trackedElement = null;
        offsetPosY = 0;
        document.body.classList.remove("dragging");
    }
}, true);