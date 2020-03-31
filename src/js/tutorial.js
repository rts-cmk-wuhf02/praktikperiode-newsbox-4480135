let tutorialTextDOM;
let tutorialTextSpanDOM;
let tutorialTextArrowDOM;

let tutorialProgress = localStorage.getItem("tutorial-progress") || 0;

const tutorialStructure = [
    {
        element: ".nav-icon-archive",
        text: "Tap here to go to your archive.",
        box: "8rem auto auto 1rem",
        arrow: "2.5rem top",
        page: "/"
    },
    {
        element: ".nav-icon-settings",
        text: "Tap here to go to settings.",
        box: "8rem 1rem auto auto",
        arrow: "12.5rem top",
        page: "/archive/"
    },
    {
        element: ".nav-icon-back",
        text: "Tap here to go back.",
        box: "8rem auto auto 1rem",
        arrow: "2.5rem top",
        page: "/settings/"
    },
    {
        element: ".dropdown-container",
        text: "Tap a category to open it.",
        box: "9rem 1rem auto 1rem",
        arrow: "50% bottom",
        page: "/"
    },
    {
        element: ".dropdown-container, .button-archive",
        text: "Swipe an item left and press the button to archive it.",
        box: "9rem 1rem auto 1rem",
        arrow: "50% bottom",
        page: "/"
    }
];

if(tutorialProgress != -1) {
    if(tutorialStructure[tutorialProgress].page != window.location.pathname) {
        window.location.pathname = tutorialStructure[tutorialProgress].page;
    }

    startTutorial();
}


function startTutorial() {
    const tutorialElement = document.createElement("div");
    tutorialElement.className = "tutorial-wrapper";

    const tutorialSkipButtonElement = document.createElement("button");
    tutorialSkipButtonElement.className = "tutorial-skip-button";
    tutorialSkipButtonElement.textContent = "Skip";
    tutorialSkipButtonElement.addEventListener("click", function() {
        tutorialProgress = -1;
        localStorage.setItem("tutorial-progress", tutorialProgress);
        document.querySelector(".tutorial-wrapper").remove();
    });

    const tutorialTextElement = document.createElement("div");
    tutorialTextElement.className = "tutorial-text";

    const tutorialTextSpanElement = document.createElement("span");

    const tutorialTextArrowElement = document.createElement("div");
    tutorialTextArrowElement.className = "tutorial-text-arrow";

    tutorialTextElement.appendChild(tutorialTextSpanElement);
    tutorialTextElement.appendChild(tutorialTextArrowElement);
    tutorialElement.appendChild(tutorialSkipButtonElement);
    tutorialElement.appendChild(tutorialTextElement);
    document.body.appendChild(tutorialElement);

    tutorialTextDOM = document.querySelector(".tutorial-text");
    tutorialTextSpanDOM = document.querySelector(".tutorial-text span");
    tutorialTextArrowDOM = document.querySelector(".tutorial-text-arrow");


    showTutorialItem();
}

function showTutorialItem() {
    const foundElements = document.querySelectorAll(tutorialStructure[tutorialProgress].element);
    foundElements.forEach(function(element) {
        element.classList.add("relative", "z-50");
        element.addEventListener("click", function() {
            if(tutorialProgress != -1) {
                tutorialProgress++;
            
                if(tutorialProgress >= tutorialStructure.length) {
                    tutorialProgress = -1;
                    localStorage.setItem("tutorial-progress", tutorialProgress);
                    document.querySelector(".tutorial-wrapper").remove();
                } else {
                    localStorage.setItem("tutorial-progress", tutorialProgress);
                    showTutorialItem();
                }
            }
        });
    });

    tutorialTextSpanDOM.innerHTML = tutorialStructure[tutorialProgress].text;
    
    let boxInfo = tutorialStructure[tutorialProgress].box.split(" ");
    let arrowInfo = tutorialStructure[tutorialProgress].arrow.split(" ");

    tutorialTextDOM.style.top = boxInfo[0];
    tutorialTextDOM.style.right = boxInfo[1];
    tutorialTextDOM.style.bottom = boxInfo[2];
    tutorialTextDOM.style.left = boxInfo[3];

    tutorialTextArrowDOM.style.left = arrowInfo[0];

    if(arrowInfo[1] == "bottom") {
        tutorialTextArrowDOM.style.top = "100%";
        tutorialTextArrowDOM.style.bottom = "auto";
        tutorialTextArrowDOM.style.transform = "scaleY(1) translateX(-50%)";
    } else {
        tutorialTextArrowDOM.style.top = "auto";
        tutorialTextArrowDOM.style.bottom = "100%";
        tutorialTextArrowDOM.style.transform = "scaleY(-1) translateX(-50%)";
    }
}