// Toggle buttons
const togglesDOM = document.querySelectorAll(".option-checkbox");

togglesDOM.forEach(function(e) {
    if(sessionStorage.getItem(e.id) == "true") {
        e.click();
    } else if(!sessionStorage.getItem(e.id)) {
        sessionStorage.setItem(e.id, "true");
        e.click();
    }

    e.addEventListener("change", function(e) {
        sessionStorage.setItem(e.target.id, e.target.checked);
    });
});


// Dark mode
const darkModeBtnDOM = document.querySelector(".dark-mode-button");

darkModeBtnDOM.addEventListener("click", function() {
    if(document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");
        sessionStorage.setItem("dark-mode", "false");
    } else {
        document.body.classList.add("dark-mode");
        sessionStorage.setItem("dark-mode", "true");
    }
});