const draggableCat = document.getElementById("cat");
let offsetX, offsetY, isDown = false;

draggableCat.querySelector("img").addEventListener("load", () => {
    const mainArea = document.getElementById("main").getBoundingClientRect();
    const draggableCatRect = draggableCat.getBoundingClientRect();
    draggableCat.style.left = (mainArea.left + Math.random()*(mainArea.width-draggableCatRect.width)) + 'px';
    draggableCat.style.top = (mainArea.top + Math.random()*(mainArea.height-draggableCatRect.height)) + 'px';
    draggableCat.style.display = "";
});

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