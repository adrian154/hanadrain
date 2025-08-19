/*
ideas - pens, pencil, highlighter/marker, printer
*/
const NOTE_RESOLUTION = 200;

const editor = document.getElementById("postit-editor"),
      editorNoteImg = document.getElementById("editor-note-img"),
      editorExplosion = document.getElementById("editor-discard-explosion");
      
const canvas = document.getElementById("postit-canvas"),
      ctx = canvas.getContext("2d");

canvas.width = NOTE_RESOLUTION;
canvas.height = NOTE_RESOLUTION;

// create a note
const createNote = (dataUrl, timestamp) => {
    
    const note = document.createElement("div");
    note.classList.add("note");

    const bgImg = document.createElement("img");
    bgImg.src = "resources/corkboard/postit.png";
    note.append(bgImg);

    const drawingImg = document.createElement("img");
    drawingImg.src = dataUrl;
    drawingImg.style.position = "absolute";
    drawingImg.style.left = "0";
    drawingImg.style.top = "0";
    note.append(drawingImg);

    const date = new Date(timestamp);
    const dateStr = document.createElement("span");
    dateStr.textContent = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    note.append(dateStr);

    document.body.append(note);
    return note;

};

const moveNoteToMouse = (note, mouseX, mouseY) => {
    const rect = note.getBoundingClientRect();
    const x = (mouseX-rect.width/2), y = mouseY - 10;
    note.style.left = x + "px";
    note.style.top = y + "px";
    note.x = x;
    note.y = y;
};

// editor logic
ctx.strokeStyle = "#ff0000";
ctx.lineWidth = 2;

let mouseDown = false,
    mouseX = 0,
    mouseY = 0;
    
let placingNote = null;
let scale = 1;

const getXY = touchEvent => {
    const rect = canvas.getBoundingClientRect();
    const touch = touchEvent.targetTouches.item(0);
    return [(touch.clientX - rect.left)*scale, (touch.clientY - rect.top)*scale];
};

canvas.addEventListener("mousedown", event => {
    mouseDown = true;
    ctx.beginPath();
    const x = event.offsetX * scale,
          y = event.offsetY * scale;
    ctx.moveTo(x, y);
    ctx.lineTo(x+1, y+1);
});

canvas.addEventListener("touchstart", event => {
    mouseDown = true;
    ctx.beginPath();
    const [x, y] = getXY(event);
    ctx.moveTo(x, y);
    ctx.lineTo(x+1, y+1);
});

canvas.addEventListener("mousemove", event => {
    if(mouseDown) {
        ctx.lineTo(event.offsetX*scale, event.offsetY*scale);
        ctx.stroke();
    }
});

canvas.addEventListener("touchmove", event => {
    if(mouseDown) {
        const [x, y] = getXY(event);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
});

window.addEventListener("mousemove", event => {
    if(placingNote) {
        moveNoteToMouse(placingNote, event.clientX, event.clientY);
    }
    mouseX = event.clientX;
    mouseY = event.clientY;
});

const finishPlacingNote = () => {
    
    // upload
    fetch("https://apis.bithole.dev/hanadrain/corkboard", {
        body: JSON.stringify({
            x: placingNote.x,
            y: placingNote.y,
            data: canvas.toDataURL()
        }),
        headers: {"Content-Type": "application/json"},
        method: "POST"
    }).then(resp => console.log(resp)).catch(console.error);

    // fix the position of the note
    placingNote = null;
};

window.addEventListener("mouseup", event => {
    if(mouseDown) {
        ctx.stroke();
    } else if(placingNote) {
        finishPlacingNote();
    }
    mouseDown = false;
    placing = false;
});

window.addEventListener("touchend", event => {
    if(mouseDown) {
        ctx.stroke();
    } else if(placingNote) {
        finishPlacingNote();
    }
    mouseDown = false;
    placing = false;
});

document.getElementById("editor-done").addEventListener("click", () => {
    
    if(!confirm("are you SURE? you will never EVER be able to edit this post-it again!!")) {
        return;
    }

    editor.style.display = "none";
    placingNote = createNote(canvas.toDataURL(), Date.now());
    moveNoteToMouse(placingNote, mouseX, mouseY);

});

document.getElementById("editor-discard").addEventListener("click", () => {

    if(!confirm("are you SURE? this will delete this post-it FOREVER!!")) {
        return; 
    }

    editorExplosion.style.display = "";
    editor.style.animationName = "fade-out";
    setTimeout(() => {
        editor.style.display = "none";
        editor.style.animationName = "";
        editorExplosion.style.display = "none";
    }, 800);    

});

document.getElementById("add-postit").addEventListener("click", () => {

    editor.style.display = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // set up canvas size
    const rect = editorNoteImg.getBoundingClientRect();
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    scale = canvas.width/rect.width;

});

fetch("https://apis.bithole.dev/hanadrain/corkboard").then(resp => resp.json()).then(notes => {
    for(const note of notes) {
        const noteElem = createNote(note.data, note.timestamp);
        noteElem.style.left = note.x + "px";
        noteElem.style.top = note.y + "px";
    }
}).catch(alert);