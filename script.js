document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const numImages = 48; // Количество кадров
    const repoURL = "https://blackgns.github.io/g6/";

    const images = [];
    const usedIndexes = new Set();

    // Начальная точка (центр экрана)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    function getRandomPosition(index) {
        return {
            x: centerX + Math.random() * 20 - 10, // Вначале куча
            y: centerY + Math.random() * 20 - 10
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

        let position = getRandomPosition(usedIndexes.size - 1);
        img.style.left = position.x + "px";
        img.style.top = position.y + "px";
        img.style.opacity = "0"; // Сначала невидимые

        images.push({
            element: img,
            x: position.x,
            y: position.y,
            speedX: (Math.random() - 0.5) * 1.5, // Скорость разлета
            speedY: (Math.random() - 0.5) * 1.5,
            isDragging: false
        });

        img.addEventListener("click", () => openFullSize(img));
        img.addEventListener("mousedown", (event) => startDrag(event, img));
    }

    function animate() {
        images.forEach((img, index) => {
            setTimeout(() => {
                img.element.style.opacity = "1"; // Постепенно появляются
                img.speedX += (Math.random() - 0.5) * 0.5;
                img.speedY += (Math.random() - 0.5) * 0.5;
            }, index * 50); // Эффект последовательного разлета

            if (!img.isDragging) {
                img.x += img.speedX;
                img.y += img.speedY;

                if (img.x <= 0 || img.x >= window.innerWidth - 100) img.speedX *= -1;
                if (img.y <= 0 || img.y >= window.innerHeight - 100) img.speedY *= -1;

                img.element.style.transform = `translate(${img.x}px, ${img.y}px)`;
            }
        });

        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 20);
    }

    setTimeout(() => {
        animate();
    }, 500); 

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
});