/*
ideas - pens, pencil, highlighter/marker, printer
*/
const NOTE_RESOLUTION = 500;

const editor = document.getElementById("postit-editor"),
      editorNoteImg = document.getElementById("editor-note-img");
      
const canvas = document.getElementById("postit-canvas"),
      ctx = canvas.getContext("2d");

canvas.width = NOTE_RESOLUTION;
canvas.height = NOTE_RESOLUTION;
canvas.style.width = NOTE_RESOLUTION/window.devicePixelRatio + "px";
canvas.style.height = canvas.style.width;
editorNoteImg.style.width = canvas.style.width;
editorNoteImg.style.height = canvas.style.width;

// create a note
const createNote = dataUrl => {
    
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
    
    document.body.append(note);
    return note;

};

const moveNoteToMouse = (note, x, y) => {
    const rect = note.getBoundingClientRect();
    note.style.left = (x - rect.width / 2) + "px";
    note.style.top = (y - 10) + "px";
};

// editor logic
ctx.strokeStyle = "#ff0000";
ctx.lineWidth = 2;

let mouseDown = false,
    mouseX = 0,
    mouseY = 0;
    
let placingNote = null;

canvas.addEventListener("mousedown", event => {
    mouseDown = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX*window.devicePixelRatio, event.offsetY*window.devicePixelRatio);
    ctx.lineTo(event.offsetX*window.devicePixelRatio+1, event.offsetY*window.devicePixelRatio+1);
});

canvas.addEventListener("mousemove", event => {
    if(mouseDown) {
        ctx.lineTo(event.offsetX*window.devicePixelRatio, event.offsetY*window.devicePixelRatio);
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

window.addEventListener("mouseup", event => {
    if(mouseDown) {
        ctx.stroke();
    } else if(placingNote) {

        // fix position of the note
        placingNote = null;

        // upload
        fetch("https://apis.bithole.dev/hanadrain/corkboard", {
            body: JSON.stringify({
                x: mouseX,
                y: mouseY,
                data: canvas.toDataURL()
            }),
            headers: {"Content-Type": "application/json"},
            method: "POST"
        }).then(resp => console.log(resp)).catch(console.error);

    }
    mouseDown = false;
    placing = false;
});

document.getElementById("editor-done").addEventListener("click", () => {
    
    if(!confirm("are you SURE? you will never EVER be able to edit this post-it again!!")) {
        return;
    }

    editor.style.display = "none";
    placingNote = createNote(canvas.toDataURL());
    moveNoteToMouse(placingNote, mouseX, mouseY);

});

document.getElementById("add-postit").addEventListener("click", () => {
    editor.style.display = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

fetch("https://apis.bithole.dev/hanadrain/corkboard").then(resp => resp.json()).then(notes => {
    for(const note of notes) {
        const noteElem = createNote(note.data);
        noteElem.style.left = note.x + "px";
        noteElem.style.top = note.y + "px";
    }
}).catch(alert);