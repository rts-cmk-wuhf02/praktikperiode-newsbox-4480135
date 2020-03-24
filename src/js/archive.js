const dropdownContainerDOM = document.querySelector(".dropdown-container");
const templateCategoryDropdownDOM = document.querySelector("#template-category-dropdown");
const templateNewsItemDOM = document.querySelector("#template-news-item");

const archivedNews = JSON.parse(sessionStorage.getItem("archived-news"));

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
});


const trashButtonsDOM = document.querySelectorAll(".button-trash");

trashButtonsDOM.forEach(function(e) {
    e.addEventListener("click", function(e) {
        const compPath = e.composedPath();

        for(let i = 0; i < compPath.length; i++) {
            if(compPath[i].classList.contains("news-item")) {
                // Remove item from data archive
                const dataID = compPath[i].getAttribute("data-id");
                const dataCategory = compPath[i].getAttribute("data-category");

                let newArchivedNews = archivedNews;
                for(let n = 0; n < newArchivedNews.length; n++) {
                    if(newArchivedNews[n].title == dataCategory) {
                        newArchivedNews[n].items.splice(dataID, 1);
                        break;
                    }
                }
                sessionStorage.setItem("archived-news", JSON.stringify(newArchivedNews));


                // Remove item from current document
                compPath[i].remove(); // TODO: Implement fade-out
                break;
            }
        }
    });
});

/*
Archived item structure:

[
    {
        headline: "",
        items: [
            {
                title: "",
                body: "",
                link: "",
                icon: ""
            }
        ]
    }
]
*/