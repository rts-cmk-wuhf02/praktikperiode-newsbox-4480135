const categoryDropdownDOM = document.querySelectorAll(".category-dropdown");

categoryDropdownDOM.forEach(function(e) {
    e.addEventListener("click", function(e) {
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
                        duration: 500
                    });
                } else {
                    compPath[i].classList.remove("turned");
                    

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
});