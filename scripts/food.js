let places = [];
const tagsSet = new Set();
const enabledTagsSet = new Set();

const book = document.getElementById("book"),
      bookPageTemplate = document.getElementById("book-page-template"),
      filters = document.getElementById("filters"),
      toc = document.getElementById("contents-list");

const STARS_IMGS = [
    "resources/food/stars0.png",
    "resources/food/stars1.png",
    "resources/food/stars2.png",
    "resources/food/stars3.png",
    "resources/food/stars4.png",
    "resources/food/stars5.png",
    "resources/food/starsMega.png"
];

let currentlyShown = null,
    animateTimeout = null;

const showPlace = place => {

    // if already shown, do nothing
    if(currentlyShown == place) {
        return;
    }

    place.tocEntry.classList.add("selected");
    window.location.hash = encodeURIComponent(place.name);

    // hide currently shown
    if(currentlyShown) {
        
        currentlyShown.page.style.display = "none";
        currentlyShown.tocEntry.classList.remove("selected");
        clearTimeout(animateTimeout);

        // display book flip animation
        if(place.position > currentlyShown?.position)
            book.classList.add("flip-forward");
        else
            book.classList.add("flip-backward");

        // show book page when done animating
        animateTimeout = setTimeout(() => {
            place.page.style.display = "";
            book.classList.remove("flip-forward");
            book.classList.remove("flip-backward");
        }, 600);

    } else {
        place.page.style.display = "";
    }

    currentlyShown = place;

};

document.getElementById("places").querySelectorAll(".place").forEach(placeDiv => {
    
    // create book page element and add to page
    const bookPage = bookPageTemplate.cloneNode(true);
    bookPage.id = null;
    bookPage.style.display = "none";
    book.append(bookPage);

    const link = bookPage.querySelector(".place-name");
    link.textContent = placeDiv.dataset.name;
    link.href = placeDiv.dataset.url;

    bookPage.querySelector(".place-location").textContent = placeDiv.dataset.location;
    bookPage.querySelector(".place-stars").src = STARS_IMGS[Number(placeDiv.dataset.stars)];
    bookPage.querySelector(".hana-sez").append(...placeDiv.querySelector(".hana-text").childNodes);
    bookPage.querySelector(".drain-sez").append(...placeDiv.querySelector(".drain-text").childNodes);
    
    // identify images
    const images = FOOD_IMAGES[placeDiv.dataset.imgId];
    if(images) {
        bookPage.querySelector(".place-image").src = images[0];
    }

    // also add to TOC
    const tocEntry = document.createElement("span");
    tocEntry.textContent = placeDiv.dataset.name;

    // collect tags
    const tags = Array.from(placeDiv.querySelector(".tags").children).map(elt => elt.textContent);
    for(const tag of tags)
        tagsSet.add(tag);

    // add to list
    const place = {name: placeDiv.dataset.name, tags: tags, page: bookPage, tocEntry: tocEntry};
    places.push(place);

    tocEntry.addEventListener("click", () => {
        showPlace(place);
    });

});

// insert toc in order
places = places.sort((a,b) => a.name.localeCompare(b.name)).map((place, i) => {
    place.position = i;
    toc.append(place.tocEntry, " \u2219 ");
    return place;
});

// set up tags
const tagFilterButtons = {};
for(const tag of Array.from(tagsSet).sort((a, b) => a.localeCompare(b))) {
    
    const filter = document.createElement("span");
    filter.classList.add("filter");
    filter.textContent = `${tag} (${places.filter(place => place.tags.includes(tag)).length})`;
    filters.append(filter);
    tagFilterButtons[tag] = filter;

    filter.addEventListener("click", () => {
        if(filter.classList.toggle("active"))
            enabledTagsSet.add(tag);
        else
            enabledTagsSet.delete(tag);
        updateFilters();   
    });

}

const updateFilters = () => {
    
    const mode = document.querySelector("input[name=filtermode]:checked").value;

    for(const place of places) {

        let shown = false;
        
        if(mode == "matchany") {
            for(const tag of place.tags) {
                if(enabledTagsSet.has(tag)) {
                    shown = true;
                }
            }
        } else if(mode == "matchall") {
            if(enabledTagsSet.size == 0) {
                shown = false;
            } else {
                shown = true;
                for(const tag of enabledTagsSet) {
                    if(!place.tags.includes(tag)) {
                        shown = false;
                    }
                }
            }
        }
        
        if(shown)
            place.tocEntry.classList.add("shown");
        else
            place.tocEntry.classList.remove("shown");

    }
};

updateFilters();

document.getElementById("filter-matchany").addEventListener("change", updateFilters);
document.getElementById("filter-matchall").addEventListener("change", updateFilters);

document.getElementById("deselect-all").addEventListener("click", () => {
    for(const tag of tagsSet) {
        enabledTagsSet.delete(tag);
        tagFilterButtons[tag].classList.remove("active");
    }
    updateFilters();
});

const place = places.find(place => place.name == decodeURIComponent(window.location.hash).slice(1));
if(place) {
    showPlace(place);
}

const move = offset => {
    const next = places[currentlyShown?.position + offset];
    if(next) {
        showPlace(next);
    }
};

window.addEventListener("keydown", event => {
    if(event.key == "ArrowLeft") {
        move(-1); 
    } else if(event.key == "ArrowRight") {
        move(1);
    }
});

// TODO: left/right buttons