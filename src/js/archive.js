// Show archived items
const dropdownContainerDOM = document.querySelector(".dropdown-container");
const templateCategoryDropdownDOM = document.querySelector("#template-category-dropdown");
const templateNewsItemDOM = document.querySelector("#template-news-item");

const archivedNews = JSON.parse(localStorage.getItem("archived-news"));
let removedItems = [];
for(let i = 0; i < archivedNews.length; i++) {
    removedItems.push(0);
}

archivedNews.forEach(function(e) {
    const dropdownClone = templateCategoryDropdownDOM.content.cloneNode(true);
    const dropdownContentCloneElement = dropdownClone.querySelector(".dropdown-content");

    dropdownClone.querySelector(".dropdown-title").innerText = e.title;
    
    for(let i = 0; i < e.items.length; i++) {
        const itemClone = templateNewsItemDOM.content.cloneNode(true);
        // Needed for removal
        itemClone.querySelector(".news-item").setAttribute("data-id", i);
        itemClone.querySelector(".news-item").setAttribute("data-category", e.title);

        // Visual information
        itemClone.querySelector(".news-item-headline").innerText = e.items[i].headline;
        itemClone.querySelector(".news-item-body").innerText = e.items[i].body;
        itemClone.querySelector(".news-item-link").href = e.items[i].link;
        itemClone.querySelector(".news-item-icon").src = e.items[i].icon;

        dropdownContentCloneElement.appendChild(itemClone);
    }

    dropdownContainerDOM.appendChild(dropdownClone);
    let element = dropdownContainerDOM.querySelector(".category-dropdown-wrapper:last-child");

    addDropdownListener(element);
});


// Trash buttons
const trashButtonsDOM = document.querySelectorAll(".button-trash");

trashButtonsDOM.forEach(function(e) {
    e.addEventListener("click", function(e) {
        const compPath = e.composedPath();

        for(let i = 0; i < compPath.length; i++) {
            if(compPath[i].classList.contains("news-item")) {
                // Remove item from data archive
                const dataID = compPath[i].getAttribute("data-id");
                const dataCategory = compPath[i].getAttribute("data-category");
                
                let categoryIsRemoved = false;
                let newArchivedNews = archivedNews;
                for(let n = 0; n < newArchivedNews.length; n++) {
                    if(newArchivedNews[n].title == dataCategory) {
                        newArchivedNews[n].items.splice(dataID - removedItems[n], 1);
                        removedItems[n]++;
                        compPath[i + 1].style.height = (9 * newArchivedNews[n].items.length) + "rem";

                        if(newArchivedNews[n].items.length == 0) {
                            categoryIsRemoved = true;
                            newArchivedNews.splice(n, 1);
                        }
                        break;
                    }
                }
                localStorage.setItem("archived-news", JSON.stringify(newArchivedNews));


                // Remove item from current document
                if(categoryIsRemoved) {
                    compPath[i + 2].style.height = compPath[i + 2].clientHeight + "px";
                    compPath[i + 2].style.transform = "translateX(100%)";
                    console.log(compPath[i + 2])
                    compPath[i + 2].classList.add("transition-h-0");

                    setTimeout(function() {
                        compPath[i + 2].classList.add("important-h-0");
                    }, 50);
                    
                    setTimeout(function() {
                        compPath[i + 2].remove();
                    }, 1500);
                } else {
                    compPath[i].style.height = "0";
                    compPath[i].style.transform = "translateX(100%)";
                    
                    setTimeout(function() {
                        compPath[i].remove();
                    }, 1500);
                }
              
                break;
            }
        }
    });
});