const draggableCat = document.getElementById("draggable-cat");
let offsetX, offsetY, isDown = false;

const randomizeCat = () => {
    const mainArea = document.body.getBoundingClientRect();
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

const makeItRain = imgSrc => {
    
    const imgs = new Set();

    const animate = () => {
        
        for(const img of imgs) {
            img.style.top = img.ypos+"px";
            img.yvel += 0.4;
            img.ypos += img.yvel;
            if(img.ypos > window.innerHeight) {
                imgs.delete(img);
                img.remove();
            }
        }

        if(Math.random()<0.2) {
            const img = document.createElement("img");
            img.src = imgSrc;
            img.style.position = "fixed";
            img.style.width = "9em";
            img.style.height = "auto";
            img.style.left = Math.random()*100+"%";
            img.ypos = -200;
            img.yvel = 0;
            imgs.add(img);
            document.body.append(img);
        }

        requestAnimationFrame(animate);
    };

    animate();

}; 

let buf = [];
window.addEventListener("keydown", event => {
    
    buf.push(event.key);
    if(buf.length > 5)
        buf.shift();

    const last4 = buf.slice(buf.length-4).join("");
    const last5 = buf.slice(buf.length-5).join("");
    if(last4 == "hana") {
        makeItRain("resources/corkboard/hanaNote.png");
    } else if(last4 == "poop") {
        makeItRain("resources/corkboard/poopNote.png");
    } else if(last5 == "drain") {
        makeItRain("resources/corkboard/drainNote.png");
    }
});
