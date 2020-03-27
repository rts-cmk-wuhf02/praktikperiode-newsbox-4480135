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
let curPosY = 0;
let trackedElement = null;
let initialTime = 0;

settingsContainerDOM.addEventListener("touchstart", function(e) {
    const compPath = e.composedPath();
    for(let i = 0; i < compPath.length; i++) {
        if(compPath[i].classList.contains("option-wrapper")) {
            trackedElement = compPath[i];
            offsetPosY = compPath[i].offsetTop + (e.touches[0].clientY - compPath[i].offsetTop);
            initialTime = e.timeStamp;

            compPath[i].classList.add("z-10");
            document.documentElement.classList.add("dragging");
            e.stopPropagation();
            break;
        }
    }
}, true);

settingsContainerDOM.addEventListener("touchmove", function(e) {
    if(trackedElement != null) {
        if(e.timeStamp < initialTime + 75) {
            trackedElement = null;
            offsetPosY = 0;
        } else {
            curPosY = -(offsetPosY - e.touches[0].clientY);
            trackedElement.style.top = curPosY + "px";
        }
    }
}, true);

settingsContainerDOM.addEventListener("touchend", function(e) {
    if(trackedElement != null) {
        // Calculate new order
        let firstOrder = parseInt(trackedElement.classList[1].replace("order-", ""));
        let elementHeight = parseFloat(getComputedStyle(document.documentElement).fontSize) * 6;
        let newOrder = Math.floor((elementHeight / 2 + curPosY) / elementHeight) + firstOrder;
        if(newOrder <= -1) newOrder = 0;
        else if(newOrder >= 5) newOrder = 4;

        // Move other elements around
        const optionWrappersDOM = document.querySelectorAll(".option-wrapper");
        for(let i = 0; i < optionWrappersDOM.length; i++) {
            if(optionWrappersDOM[i] != trackedElement) {
                const orderThis = parseInt(optionWrappersDOM[i].classList[1].replace("order-", ""));
                let newOrderThis = orderThis;
                
                if((orderThis > firstOrder && orderThis <= newOrder)) {
                    newOrderThis--;
                    optionWrappersDOM[i].classList.add("animate-down");
                } else if (orderThis < firstOrder && orderThis >= newOrder) {
                    newOrderThis++;
                    optionWrappersDOM[i].classList.add("animate-up");
                }

                setTimeout(function() {
                    optionWrappersDOM[i].classList.remove("animate-down", "animate-up");
                }, 500);
                
                optionWrappersDOM[i].classList.remove(optionWrappersDOM[i].classList[1]);
                optionWrappersDOM[i].classList.add("order-" + newOrderThis);
            }
        }

        // Replace old order with new order
        trackedElement.classList.replace(trackedElement.classList[1], "order-" + newOrder);

        // Change saved order
        let name = categoryOrder.splice(firstOrder, 1);
        categoryOrder.splice(newOrder, 0, name[0]);
        localStorage.setItem("category-order", JSON.stringify(categoryOrder));

        
        // Reset values
        trackedElement.style.top = "0px";
        trackedElement.classList.remove("z-10");
        trackedElement = null;
        offsetPosY = 0;
        curPosY = 0;
        document.documentElement.classList.remove("dragging");
    }
}, true);