function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(null, (data) => {
    const list = document.getElementById("stats");
    const colorCount = 6; // number of color classes available
    let index = 0;

    Object.entries(data).forEach(([domain, time]) => {
      const li = document.createElement("li");
      const colorClass = `color-${(index % colorCount) + 1}`;
      li.className = colorClass;
      li.innerHTML = `<span>${domain}</span><span>${formatTime(time)}</span>`;
      list.appendChild(li);
      index++;
    });
  });

  document.getElementById("reset").addEventListener("click", () => {
    chrome.storage.local.clear(() => location.reload());
  });
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}
