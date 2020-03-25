// Toggle buttons
const togglesDOM = document.querySelectorAll(".option-checkbox");

togglesDOM.forEach(function(e) {
    if(localStorage.getItem(e.id) == "true") {
        e.click();
    } else if(!localStorage.getItem(e.id)) {
        localStorage.setItem(e.id, "true");
        e.click();
    }

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