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
        itemClone.querySelector(".news-item-headline").innerText = e.items[i].headline;
        itemClone.querySelector(".news-item-body").innerText = e.items[i].body;
        itemClone.querySelector(".news-item-link").href = e.items[i].link;
        itemClone.querySelector(".news-item-icon").src = e.items[i].icon;

        dropdownContentCloneElement.appendChild(itemClone);
    }

    dropdownContainerDOM.appendChild(dropdownClone);
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