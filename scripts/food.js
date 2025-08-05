const places = [];
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

let currentlyShown = null;

document.getElementById("places").querySelectorAll(".place").forEach(placeDiv => {
    
    // create book page element and add to page
    const bookPage = bookPageTemplate.cloneNode(true);
    bookPage.id = null;
    bookPage.style.display = "none";
    book.append(bookPage);

    bookPage.querySelector(".place-name").textContent = placeDiv.dataset.name;
    bookPage.querySelector(".place-location").textContent = placeDiv.dataset.location;
    bookPage.querySelector(".place-stars").src = STARS_IMGS[Number(placeDiv.dataset.stars)];
    bookPage.querySelector(".hana-sez").append(...placeDiv.querySelector(".hana-text").childNodes);
    bookPage.querySelector(".drain-sez").append(...placeDiv.querySelector(".drain-text").childNodes);
    
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

        if(currentlyShown)
            currentlyShown.page.style.display = "none";

        if(place.position > currentlyShown?.position)
            book.classList.add("flip-forward");
        else
            book.classList.add("flip-backward");

        currentlyShown = place;
        setTimeout(() => {
            bookPage.style.display = "";
            book.classList.remove("flip-forward");
            book.classList.remove("flip-backward");
        }, 600);
    
    });

});

// insert toc in order
places.sort((a,b) => a.name.localeCompare(b.name)).forEach((place, i) => {
    place.position = i;
    toc.append(place.tocEntry, " \u2219 ");
});

// set up tags
const tagFilterButtons = {};
for(const tag of Array.from(tagsSet).sort((a, b) => a.localeCompare(b))) {
    
    const filter = document.createElement("span");
    filter.classList.add("filter", "active");
    filter.textContent = tag;
    filters.append(filter);
    enabledTagsSet.add(tag);
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
    
    for(const place of places) {
        let shown = false;
        for(const tag of place.tags) {
            if(enabledTagsSet.has(tag)) {
                shown = true;
            }
        }
        if(shown)
            place.tocEntry.style.fontSize = "1em";
        else
            place.tocEntry.style.fontSize = "0.5em";
    }
};

document.getElementById("select-all").addEventListener("click", () => {
    for(const tag of tagsSet) {
        enabledTagsSet.add(tag);
        tagFilterButtons[tag].classList.add("active");
    }
    updateFilters();
});

document.getElementById("deselect-all").addEventListener("click", () => {
    for(const tag of tagsSet) {
        enabledTagsSet.delete(tag);
        tagFilterButtons[tag].classList.remove("active");
    }
    updateFilters();
});