(function () {
  function initializeTheme() {
    function fillGrid() {
      const grid = document.querySelector(".terminal__posts");

      if (!grid) {
        return;
      }

      grid.querySelectorAll(".post--empty").forEach((element) => {
        element.remove();
      });

      const posts = [
        ...grid.querySelectorAll(".post__item:not(.post--empty)"),
      ];
      const width = window.innerWidth;
      let columns;

      if (width >= 768) {
        columns = 3;
      } else if (width >= 480) {
        columns = 2;
      } else {
        columns = 1;
      }

      const remainder = posts.length % columns;

      if (remainder !== 0) {
        const emptyCount = columns - remainder;

        for (let index = 0; index < emptyCount; index++) {
          const empty = document.createElement("div");
          empty.className = "post__item post--empty";
          grid.appendChild(empty);
        }
      }
    }

    const horizontalGuide = document.querySelector(
      ".mouse-guide--horizontal",
    );
    const verticalGuide = document.querySelector(".mouse-guide--vertical");

    if (horizontalGuide && verticalGuide) {
      window.addEventListener("mousemove", (event) => {
        horizontalGuide.style.top = `${event.clientY}px`;
        verticalGuide.style.left = `${event.clientX}px`;
      });
    }

    const scrambleCharacters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    function scrambleText(element) {
      const finalText = element.textContent;
      const settleDelay = Number(element.dataset.scrambleSpeed) || 70;

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      let currentIndex = 0;

      function randomCharacter() {
        return scrambleCharacters[
          Math.floor(Math.random() * scrambleCharacters.length)
        ];
      }

      function animate() {
        element.textContent = finalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < currentIndex) return char;

            return randomCharacter();
          })
          .join("");

        currentIndex++;

        if (currentIndex <= finalText.length) {
          setTimeout(animate, settleDelay);
        } else {
          element.textContent = finalText;
        }
      }

      animate();
    }

    document.querySelectorAll(".text-scramble").forEach(scrambleText);
    fillGrid();
    window.addEventListener("resize", fillGrid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTheme);
  } else {
    initializeTheme();
  }
})();
