(function () {
    var scripts = document.getElementsByTagName("script"),
        regex = /(?<=(\"|\'|\`))\/[a-zA-Z0-9_?&=\/\-\#\.]*(?=(\"|\'|\`))/g;
    const results = new Set();

    for (var i = 0; i < scripts.length; i++) {
        var t = scripts[i].src;
        if (t) {
            fetch(t)
                .then((response) => response.text())
                .then((text) => {
                    const matches = text.matchAll(regex);
                    for (let match of matches) results.add(match[0]);
                    updateUI();
                })
                .catch((error) => console.error("Error fetching script:", error));
        }
    }

    var pageContent = document.documentElement.outerHTML;
    var matches = pageContent.matchAll(regex);
    for (const match of matches) results.add(match[0]);
    setTimeout(() => { updateUI() }, 2000); // Wait for all the script fetch requests

    function updateUI() {
        let existingBox = document.getElementById("script-results-box");
        if (!existingBox) {
            existingBox = document.createElement("div");
            existingBox.id = "script-results-box";
            existingBox.style.position = "fixed";
            existingBox.style.bottom = "20px";
            existingBox.style.right = "20px";
            existingBox.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
            existingBox.style.color = "white";
            existingBox.style.padding = "10px";
            existingBox.style.borderRadius = "12px";
            existingBox.style.zIndex = "9999";
            existingBox.style.maxHeight = "400px"; // Increased height
            existingBox.style.overflowY = "auto";
            existingBox.style.boxShadow = "0px 0px 15px rgba(0, 0, 0, 0.6)";
            existingBox.style.fontFamily = "Arial, sans-serif";
            existingBox.style.fontSize = "13px";
            existingBox.style.width = "420px"; // Increased width
            existingBox.style.wordWrap = "break-word";
            existingBox.style.display = "flex";
            existingBox.style.flexDirection = "column";

            document.body.appendChild(existingBox);

            // Create full-width close button
            let closeButton = document.createElement("button");
            closeButton.innerHTML = "Close";
            closeButton.style.width = "100%";
            closeButton.style.background = "red";
            closeButton.style.color = "white";
            closeButton.style.border = "none";
            closeButton.style.fontSize = "18px"; // Readable size
            closeButton.style.cursor = "pointer";
            closeButton.style.padding = "10px";
            closeButton.style.borderRadius = "10px 10px 0 0"; // Rounded top corners
            closeButton.style.fontWeight = "bold";
            closeButton.style.transition = "background 0.3s ease";
            closeButton.addEventListener("mouseover", () => (closeButton.style.background = "darkred"));
            closeButton.addEventListener("mouseout", () => (closeButton.style.background = "red"));
            closeButton.addEventListener("click", () => existingBox.remove());

            existingBox.appendChild(closeButton);

            // Create container for results
            let resultContainer = document.createElement("div");
            resultContainer.id = "script-results-content";
            resultContainer.style.marginTop = "10px";
            resultContainer.style.flexGrow = "1";
            resultContainer.style.overflowY = "auto";
            resultContainer.style.padding = "10px";

            existingBox.appendChild(resultContainer);
        }

        let resultContainer = document.getElementById("script-results-content");
        resultContainer.innerHTML = ""; // Clear previous results

        results.forEach((path) => {
            let item = document.createElement("div");
            if(path.match(/^\/\/[a-zA-Z0-9].*/)) {
                path = path.replace(/^\/\/(?=[a-zA-Z0-9])/, "https://");
            }
            item.innerText = path;
            item.style.padding = "8px";
            item.style.borderBottom = "1px solid rgba(255, 255, 255, 0.2)";
            item.style.cursor = "text";
            item.style.userSelect = "text";
            resultContainer.appendChild(item);
        });
    }
   })();

