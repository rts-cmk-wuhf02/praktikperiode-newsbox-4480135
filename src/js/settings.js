let options = [
    {
        url: "https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml",
        enabled: true,
        name: "Europe"
    },
    {
        url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml",
        enabled: true,
        name: "Health"
    },
    {
        url: "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml",
        enabled: true,
        name: "Sports"
    },
    {
        url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
        enabled: true,
        name: "Business"
    },
    {
        url: "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml",
        enabled: true,
        name: "Travel"
    }
];
if(localStorage.getItem("options")) options = JSON.parse(localStorage.getItem("options"));


// Add options to settings page
const settingsContainerDOM = document.querySelector(".settings-container");
const templateOptionWrapperDOM = document.querySelector(".template-option-wrapper");

for(let i = 0; i < options.length; i++) {
    const optionWrapperElement = templateOptionWrapperDOM.content.cloneNode(true);
    
    optionWrapperElement.querySelector(".card-title").innerText = options[i].name;
    optionWrapperElement.querySelector(".option-checkbox").setAttribute("url", options[i].url);
    optionWrapperElement.querySelector(".option-checkbox").id = "option-" + options[i].name;
    optionWrapperElement.querySelector(".option-label").setAttribute("for", "option-" + options[i].name);

    settingsContainerDOM.appendChild(optionWrapperElement);
}


// Toggle buttons
const togglesDOM = document.querySelectorAll(".option-checkbox");

togglesDOM.forEach(function(e) {
    let url = e.getAttribute("url");
    for(let i = 0; i < options.length; i++) {
        if(options[i].url == url) {
            // Set value based on saved data
            if(options[i].enabled != false) {
                e.click();
            }

            // Change category order
            e.parentNode.classList.add("order-" + i);
            break;
        }
    }

    e.addEventListener("change", function(e) {
        let url = e.target.getAttribute("url");
        let foundItem = false;

        for(let i = 0; i < options.length; i++) {
            if(options[i].url == url) {
                options[i].enabled = e.target.checked;
                foundItem = true;
                break;
            }
        }

        if(!foundItem) {
            options.push({
                url: url,
                enabled: e.target.checked,
                name: e.target.getAttribute("url")
            });
        }

        localStorage.setItem("options", JSON.stringify(options));
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

// Sign up and sign out
const signUpBtnDOM = document.querySelector(".sign-up-button");
const signOutBtnDOM = document.querySelector(".sign-out-button");

if(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1") != "") {
    signUpBtnDOM.remove();

    signOutBtnDOM.addEventListener("click", function() {
        document.cookie.replace(/(;|^)(jwt=([^;]*).)/, "$1"); // Removes cookie
    });
} else {
    signUpBtnDOM.addEventListener("click", function() {
        window.location.href = "https://distracted-montalcini-ba1430.netlify.app/api/auth/github";
    });

    signOutBtnDOM.remove();
}


// Move options around
let offsetPosY = 0;
let curPosY = 0;
let trackedElement = null;

settingsContainerDOM.addEventListener("touchstart", function(e) {
    const compPath = e.composedPath();
    for(let i = 0; i < compPath.length; i++) {
        if(compPath[i].classList.contains("option-wrapper")) {
            trackedElement = compPath[i];
            offsetPosY = compPath[i].offsetTop + (e.touches[0].clientY - compPath[i].offsetTop);

            compPath[i].classList.add("z-10");
            document.documentElement.classList.add("dragging");
            e.stopPropagation();
            break;
        }
    }
}, true);

settingsContainerDOM.addEventListener("touchmove", function(e) {
    if(trackedElement != null) {
        curPosY = -(offsetPosY - e.touches[0].clientY);
        trackedElement.style.top = curPosY + "px";
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
        let item = options.splice(firstOrder, 1);
        options.splice(newOrder, 0, item[0]);
        localStorage.setItem("options", JSON.stringify(options));

        
        // Reset values
        trackedElement.style.top = "0px";
        trackedElement.classList.remove("z-10");
        trackedElement = null;
        offsetPosY = 0;
        curPosY = 0;
        document.documentElement.classList.remove("dragging");
    }
}, true);