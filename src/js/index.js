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




let optionEurope = sessionStorage.getItem("option-europe");
let optionBusiness = sessionStorage.getItem("option-business");
let optionHealth = sessionStorage.getItem("option-health");
let optionTravel = sessionStorage.getItem("option-travel");
let optionSport = sessionStorage.getItem("option-sport");

if(optionEurope == "true") {
    fetch("https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml").then(function(response) {
        return response.text();
    }).then(function(data) {
        showData(data);
    });
}

if(optionBusiness == "true") {
    fetch("https://rss.nytimes.com/services/xml/rss/nyt/Business.xml").then(function(response) {
        return response.text();
    }).then(function(data) {
        showData(data);
    });
}

if(optionHealth == "true") {
    fetch("https://rss.nytimes.com/services/xml/rss/nyt/Health.xml").then(function(response) {
        return response.text();
    }).then(function(data) {
        showData(data);
    });
}

if(optionTravel == "true") {
    fetch("https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml").then(function(response) {
        return response.text();
    }).then(function(data) {
        showData(data);
    });
}

if(optionSport == "true") {
    fetch("https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml").then(function(response) {
        return response.text();
    }).then(function(data) {
        showData(data);
    });
}


function showData(data) {
    const parser = new DOMParser();
    const srcDOM = parser.parseFromString(data, "application/xml");

    const jsonData = xml2json(srcDOM);
    console.log(jsonData)

    const dropdownContainerDOM = document.querySelector(".dropdown-container");
    const templateCategoryDropdownDOM = document.querySelector("#template-category-dropdown");
    const templateNewsItemDOM = document.querySelector("#template-news-item");


    const dropdownClone = templateCategoryDropdownDOM.content.cloneNode(true);
    const dropdownContentCloneElement = dropdownClone.querySelector(".dropdown-content");

    dropdownClone.querySelector(".dropdown-title").innerText = jsonData.rss.channel.title.split("&gt;")[jsonData.rss.channel.title.split("&gt;").length - 1];
    
    let items = jsonData.rss.channel.item;
    for(let i = 0; i < items.length; i++) {
        const itemClone = templateNewsItemDOM.content.cloneNode(true);
        // Needed for removal
        itemClone.querySelector(".news-item").setAttribute("data-id", i);
        itemClone.querySelector(".news-item").setAttribute("data-category", items.title);

        // Visual information
        itemClone.querySelector(".news-item-headline").innerText = items[i].title;
        itemClone.querySelector(".news-item-body").innerText = items[i].description;
        itemClone.querySelector(".news-item-link").href = items[i].link;

        if(items[i]["media:content"]) itemClone.querySelector(".news-item-icon").src = items[i]["media:content"].attributes.url;
        else itemClone.querySelector(".news-item-icon").src = jsonData.rss.channel.image.url;

        dropdownContentCloneElement.appendChild(itemClone);
    }
    
    dropdownContainerDOM.appendChild(dropdownClone);
    let x = dropdownContainerDOM.querySelector(".category-dropdown-wrapper:last-child");
    
    addDropdownListener(x);
}