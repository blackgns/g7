document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const numImages = 48; 
    const repoURL = "https://blackgns.github.io/g6/";
    
    let speedMultiplier = 1; 
    let isPaused = false; 

    const images = [];
    const usedIndexes = new Set();

    function getRandomPosition() {
        return {
            x: Math.random() * 3000 - 1500, /* Разброс по вселенной */
            y: Math.random() * 3000 - 1500
        };
    }

    while (usedIndexes.size < numImages) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * numImages) + 1;
        } while (usedIndexes.has(randomIndex));

        usedIndexes.add(randomIndex);

        const img = document.createElement("img");
        img.src = `${repoURL}frame${randomIndex}.jpg`;
        img.classList.add("image");
        img.setAttribute("data-fullsize", img.src);

        container.appendChild(img);

        let position = getRandomPosition();
        img.style.left = position.x + "px";
        img.style.top = position.y + "px";

        images.push({
            element: img,
            x: position.x,
            y: position.y,
            speedX: (Math.random() - 0.5) * 1, 
            speedY: (Math.random() - 0.5) * 1,
            isDragging: false
        });

        img.addEventListener("click", () => openFullSize(img));
        img.addEventListener("mousedown", (event) => startDrag(event, img));
    }

    function animate() {
        if (!isPaused) {
            images.forEach(img => {
                if (!img.isDragging) {
                    img.x += img.speedX * speedMultiplier;
                    img.y += img.speedY * speedMultiplier;

                    img.element.style.transform = `translate(${img.x}px, ${img.y}px)`;
                }
            });
        }
        requestAnimationFrame(animate);
    }

    animate();

    function openFullSize(img) {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        const fullSizeImg = document.createElement("img");
        fullSizeImg.src = img.getAttribute("data-fullsize");
        fullSizeImg.classList.add("fullsize-image");

        const closeButton = document.createElement("div");
        closeButton.classList.add("close-button");
        closeButton.innerHTML = "✖";
        closeButton.addEventListener("click", () => overlay.remove());

        overlay.appendChild(fullSizeImg);
        overlay.appendChild(closeButton);
        document.body.appendChild(overlay);

        setTimeout(() => {
            if (document.body.contains(overlay)) overlay.remove();
        }, 5000);
    }

    function startDrag(event, imgElement) {
        const imgObj = images.find(img => img.element === imgElement);
        if (!imgObj) return;

        imgObj.isDragging = true;
        let offsetX = event.clientX - imgElement.offsetLeft;
        let offsetY = event.clientY - imgElement.offsetTop;

        function onMouseMove(event) {
            imgObj.x = event.clientX - offsetX;
            imgObj.y = event.clientY - offsetY;
            imgElement.style.transform = `translate(${imgObj.x}px, ${imgObj.y}px)`;
        }

        function onMouseUp() {
            imgObj.isDragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    // 🔥 Кнопка "Stop"
    document.getElementById("pauseButton").addEventListener("click", () => {
        isPaused = !isPaused;
        document.getElementById("pauseButton").innerText = isPaused ? "Play" : "Stop";
    });

    // 🔥 Кнопка "Chaos" (ускорение движения)
    document.getElementById("chaosButton").addEventListener("click", () => {
        speedMultiplier = 5; 
        setTimeout(() => { speedMultiplier = 1; }, 3000);
    });
});