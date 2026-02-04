let ugcData = [];

function renderGallery(items, containerId="ugcGrid") {
  const grid = document.getElementById(containerId);
  grid.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "ugc-card";
    div.innerHTML = `
      <img src="${item.sprite}" style="width:${item.frameWidth}px;height:${item.frameHeight}px">
      <div>${item.name}</div>
      <div>${item.creator}</div>
      <a href="ugc.html?ugc=${item.id}">View Sprite</a>
    `;
    grid.appendChild(div);
  });
}

function setupSearch(inputId="searchInput", containerId="ugcGrid") {
  const input = document.getElementById(inputId);
  input.addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    const filtered = ugcData.filter(item =>
      item.name.toLowerCase().includes(term) || item.creator.toLowerCase().includes(term)
    );
    renderGallery(filtered, containerId);
  });
}

function initGallery(containerId="ugcGrid", searchId="searchInput") {
  fetch("/api/ugc") // <-- fetches live UGC JSON
    .then(r => r.json())
    .then(data => {
      ugcData = data;
      renderGallery(ugcData, containerId);
      setupSearch(searchId, containerId);
    })
    .catch(err => console.error("Failed to load UGC JSON:", err));
}
