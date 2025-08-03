const filters = document.getElementById("filters");

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