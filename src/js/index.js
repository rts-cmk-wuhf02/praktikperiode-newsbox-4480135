isIndexPage = true;

// Category order
let categoryOrder = [
    "Europe",
    "Business",
    "Health",
    "Travel",
    "Sports",
];
if(localStorage.getItem("category-order") != undefined) categoryOrder = JSON.parse(localStorage.getItem("category-order"));

// DOM
const dropdownContainerDOM = document.querySelector(".dropdown-container");
const templateCategoryDropdownDOM = document.querySelector("#template-category-dropdown");
const templateNewsItemDOM = document.querySelector("#template-news-item");


// Fetch news data
let options = JSON.parse(localStorage.getItem("options"));

options.forEach(function(e) {
    if(e.enabled != false) {
        fetchData(e.url);
    }
});


function fetchData(url) {
    return fetch(url).then(function(response) {
        return response.text();
    }).then(function(data) {
        showData(data);

        return new Promise((resolveFunc, rejectFunc) => {
            resolveFunc(true);
        });
    });
}


// Hide refresh
function hideRefresh() {
    dropdownContainerDOM.style = "";
    document.querySelector(".refresh-block").classList.remove("visible");
}


// Refresh news
function refreshNews() {
    const categoryDropdownContentsDOM = document.querySelectorAll(".category-dropdown-wrapper");

    for(let i = 0; i < categoryDropdownContentsDOM.length; i++) {
        categoryDropdownContentsDOM[i].remove();
    }


    
    let passes = [];
    for(let i = 0; i < options.length; i++) {
        passes.push(true);

        if(options[i].enabled != false) {
            passes[i] = false;

            fetchData(options[i].url).then(function() {
                passes[i] = true;

                if(passes.find(function(e) {
                    return e == false;
                }) == undefined) {
                    hideRefresh();
                }
            });
        }
    }
    
    document.body.classList.remove("refreshing");
}


// Show data
function showData(data) {
    const parser = new DOMParser();
    const srcDOM = parser.parseFromString(data, "application/xml");

    const jsonData = xml2json(srcDOM);


    const dropdownClone = templateCategoryDropdownDOM.content.cloneNode(true);
    const dropdownContentCloneElement = dropdownClone.querySelector(".dropdown-content");

    const categoryTitle = jsonData.rss.channel.title.split("&gt; ")[jsonData.rss.channel.title.split("&gt; ").length - 1];
    dropdownClone.querySelector(".dropdown-title").innerText = categoryTitle;
    
    let items = jsonData.rss.channel.item;
    for(let i = 0; i < items.length; i++) {
        const itemClone = templateNewsItemDOM.content.cloneNode(true);
        // Needed for removal
        itemClone.querySelector(".news-item").setAttribute("data-guid", items[i].guid.text);
        itemClone.querySelector(".news-item").setAttribute("data-category", categoryTitle);

        // Visual information
        itemClone.querySelector(".news-item-headline").innerText = items[i].title;
        itemClone.querySelector(".news-item-body").innerText = items[i].description;
        itemClone.querySelector(".news-item-link").href = items[i].link;

        if(items[i]["media:content"]) itemClone.querySelector(".news-item-icon").src = items[i]["media:content"].attributes.url;
        else itemClone.querySelector(".news-item-icon").src = jsonData.rss.channel.image.url;

        dropdownContentCloneElement.appendChild(itemClone);
    }
    
    dropdownContainerDOM.appendChild(dropdownClone);
    let element = dropdownContainerDOM.querySelector(".category-dropdown-wrapper:last-child");
    element.classList.add("order-" + categoryOrder.indexOf(categoryTitle));
    
    addDropdownListener(element);



    // Archive buttons
    const archiveButtonDOM = element.querySelectorAll(".button-archive");

    archiveButtonDOM.forEach(function(e) {
        e.addEventListener("click", function(e) {
            const compPath = e.composedPath();
            
            for(let i = 0; i < compPath.length; i++) {
                if(compPath[i].classList.contains("news-item")) {
                    compPath[i].style.transform = "translateX(0)";
                    let newArchivedNews = [];
                    if(localStorage.getItem("archived-news")) newArchivedNews = JSON.parse(localStorage.getItem("archived-news"));
                    
                    
                    // Add to archived news
                    const categoryTitle = compPath[i].getAttribute("data-category");
                    const itemGuid = compPath[i].getAttribute("data-guid");
                    
                    let foundCategory = false;
                    
                    for(let j = 0; j < newArchivedNews.length; j++) {
                        if(newArchivedNews[j].title === categoryTitle) {
                            console.log("found")
                            if(newArchivedNews[j].items.find(function(e) {
                                return e.guid === itemGuid;
                            }) == undefined) {
                                newArchivedNews[j].items.push({
                                    headline: compPath[i].querySelector(".news-item-headline").innerText,
                                    body: compPath[i].querySelector(".news-item-body").innerText,
                                    link: compPath[i].querySelector(".news-item-link").href,
                                    icon: compPath[i].querySelector(".news-item-icon").src,
                                    guid: itemGuid
                                });
                            }
                            
                            foundCategory = true;
                            break;
                        }
                    }
                    
                    if(!foundCategory) {
                        newArchivedNews.push({
                            title: categoryTitle,
                            items: []
                        });
                        newArchivedNews[newArchivedNews.length - 1].items.push({
                            headline: compPath[i].querySelector(".news-item-headline").innerText,
                            body: compPath[i].querySelector(".news-item-body").innerText,
                            link: compPath[i].querySelector(".news-item-link").href,
                            icon: compPath[i].querySelector(".news-item-icon").src,
                            guid: itemGuid
                        });
                    }
                    
                    
                    localStorage.setItem("archived-news", JSON.stringify(newArchivedNews));
                    break;
                }
            }
        });
    });
}


// XML to JSON
function xml2json(srcDOM) {
    let children = [...srcDOM.children];
    
    if (!children.length) {
        if(srcDOM.attributes && srcDOM.attributes.length > 0) {
            let attributeData = {};
            attributeData.attributes = {};

            for(let i = 0; i < srcDOM.attributes.length; i++) {
                attributeData.attributes[srcDOM.attributes[i].name] = srcDOM.attributes[i].value;
            }

            attributeData.text = srcDOM.innerHTML;

            return attributeData;
        } else {
            return srcDOM.innerHTML;
        }
    }

    
    let jsonResult = {};

    for (let child of children) {
        // checking is child has siblings of same name. 
        let childIsArray = children.filter(eachChild => eachChild.nodeName === child.nodeName).length > 1;

        // if child is array, save the values as array, else as strings. 
        if (childIsArray) {
            if (jsonResult[child.nodeName] === undefined) {
                jsonResult[child.nodeName] = [xml2json(child)];
            } else {
                jsonResult[child.nodeName].push(xml2json(child));
            }
        } else {
            jsonResult[child.nodeName] = xml2json(child);
        }
    }

    // Attributes
    if(srcDOM.attributes && srcDOM.attributes.length > 0) {
        jsonResult.attributes = {};
        
        for(let i = 0; i < srcDOM.attributes.length; i++) {
            jsonResult.attributes[srcDOM.attributes[i].name] = srcDOM.attributes[i].value;
        }
    }


    return jsonResult;
}