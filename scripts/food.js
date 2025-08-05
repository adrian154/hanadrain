const places = [];
const tagsSet = new Set();
const enabledTagsSet = new Set();

const book = document.getElementById("book"),
      bookPageTemplate = document.getElementById("book-page-template"),
      filters = document.getElementById("filters");

const STARS_IMGS = ["resources/food/stars0.png", "resources/food/stars1.png", "resources/food/stars2.png", "resources/food/stars3.png", "resources/food/stars4.png", "resources/food/stars5.png", "resources/food/starsMega.png"];

document.getElementById("places").querySelectorAll(".place").forEach(placeDiv => {
    
    // create book page element and add to page
    const bookPage = bookPageTemplate.cloneNode(true);
    bookPage.id = null;
    bookPage.style.display = "";
    book.append(bookPage);

    bookPage.querySelector(".place-name").textContent = placeDiv.dataset.name;
    bookPage.querySelector(".place-location").textContent = placeDiv.dataset.location;
    bookPage.querySelector(".place-stars").src = STARS_IMGS[Number(placeDiv.dataset.stars)];
    bookPage.querySelector(".hana-sez").append(...placeDiv.querySelector(".hana-text").childNodes);
    bookPage.querySelector(".drain-sez").append(...placeDiv.querySelector(".drain-text").childNodes);
    
    // collect tags
    const tags = Array.from(placeDiv.querySelector(".tags").children).map(elt => elt.textContent);
    for(const tag of tags)
        tagsSet.add(tag);

    places.push({tags: tags, element: bookPage});

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
            place.element.style.display = "";
        else
            place.element.style.display = "none";
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

/*const filters = document.getElementById("filters");

// iterate through places, get a list of all tags
const allTagsSet = new Set();
const places = [];

document.querySelectorAll(".Place").forEach(place => {
    const tags = [...place.querySelectorAll(".tag")].map(tag => tag.textContent);
    for(const tag of tags) {
        allTagsSet.add(tag);
    }
    places.push(place);
    place.tags = tags;
});

const allTags = Array.from(allTagsSet).sort((a, b) => a.localeCompare(b));
const shownTags = new Set(allTags);

const updateFilters = () => {
    for(const place of places) {
        let show = false;
        for(const tag of place.tags) {
            if(shownTags.has(tag)) show = true;
        }
        place.style.display = show ? "" : "none";
    }
};

for(const tag of allTags) {
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = 1;
    const id = (checkbox.id = "filters-" + tag);

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = tag;

    checkbox.addEventListener("change", () => {
        if(checkbox.checked) {
            shownTags.add(tag);
        } else {
            shownTags.delete(tag);
        }
        updateFilters();
    });

    filters.append(checkbox, label);

}
*/