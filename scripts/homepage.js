const draggableCat = document.getElementById("draggable-cat");
let offsetX, offsetY, isDown = false;

const randomizeCat = () => {
    const mainArea = document.querySelector("main").getBoundingClientRect();
    const draggableCatRect = draggableCat.getBoundingClientRect();
    draggableCat.style.left = (mainArea.left + Math.random()*(mainArea.width-draggableCatRect.width)) + 'px';
    draggableCat.style.top = (mainArea.top + Math.random()*(mainArea.height-draggableCatRect.height)) + 'px';
    draggableCat.classList.add("shown");
};

const draggableCatImg = draggableCat.querySelector("img");
if(draggableCatImg.complete) {
    randomizeCat();
} else {
    draggableCatImg.addEventListener("load", randomizeCat);
}

draggableCat.addEventListener('mousedown', function(e) {
    isDown = true;
    offsetX = e.clientX - draggableCat.offsetLeft;
    offsetY = e.clientY - draggableCat.offsetTop;
    document.body.style.userSelect = "none";
});

document.addEventListener('mouseup', function() {
    isDown = false;
    document.body.style.userSelect = "";
});

document.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    draggableCat.style.left = (e.clientX - offsetX) + 'px';
    draggableCat.style.top = (e.clientY - offsetY) + 'px';
});