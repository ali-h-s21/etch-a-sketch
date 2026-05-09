let canvas;
let color = "custom";
let isMouseDrawing = false;
let drawingMode = "none"; // mouse || arrows || none
let topPixel = null;
let buttomPixel = null;
document.addEventListener("DOMContentLoaded", function () {
  const drawingWithArrowsBtn = document.getElementById("arrows");
  const drawingWithMouseBtn = document.getElementById("hover");
  const canvasResizer = document.querySelector(".slider");
  const canvasSizeDisplay = document.querySelector(".size-value");
  canvasResizer.value = 5; // resetting the value for the slider on page load
  canvas = document.getElementById("canvas");
  createGrid();

  canvasResizer.addEventListener("input", (e) => {
    let gridSizeInput = e.target.value;
    canvasSizeDisplay.textContent = `${gridSizeInput} X ${gridSizeInput}`;
    resizeGrid(gridSizeInput);
  });
  drawingWithArrowsBtn.addEventListener("click", activateArrowsMode);
  drawingWithMouseBtn.addEventListener("click", activateMouseMode);

  canvas.addEventListener("pointerdown", pointerDownHandler);
  canvas.addEventListener("pointermove", delegatedDrawOnHover);
  // this is in case the user releases the mouse click outside the canvas
  window.addEventListener("pointerup", pointerUpHandler);

  //  listening to all colors buttons
  $(".colors-box .btn").click(function () {
    let id = $(this).attr("id");
    if (id !== "clear") {
      color = id;
    } else {
      clear();
    }
  });
});

// ======= functions ========

// move the line with arrows

// ============

function drawOnHover(e) {
  setColor(e.target);
}

// creat the grid
function createGrid(size = 5) {
  canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  let gridSize = size ** 2;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < gridSize; i++) {
    let pixel = document.createElement("div");
    pixel.tabIndex = i;
    pixel.className = "pixel";
    fragment.appendChild(pixel);
  }

  canvas.appendChild(fragment);
}

// resize the grid
function resizeGrid(value) {
  canvas.innerHTML = "";
  createGrid(value);
}
// ============ colors Functioons ==========
// set the  Color
function setColor(currentPixel) {
  switch (color) {
    case "warm":
      warmColor(currentPixel);
      break;
    case "cold":
      coldColor(currentPixel);
      break;
    case "rainbow":
      rainbowColor(currentPixel);
      break;
    case "gray":
      grayScale(currentPixel);
      break;
    default:
      inputColor(currentPixel);
  }
}

// input color
function inputColor(currentPixel) {
  let colorPickerVlaue = $(".color-picker").val();
  currentPixel.style.backgroundColor = colorPickerVlaue;
}

// warm colors
function warmColor(currentPixel) {
  let randomRed = Math.floor(Math.random() * 255) + 1;
  let randomYellow = Math.floor(Math.random() * 8);
  currentPixel.css(
    "background-color",
    `rgba(255,${randomRed},${randomYellow},1)`,
  );
}

// colold colors
function coldColor(currentPixel) {
  const warmColors = ["#2389da", "#1ca3ec", "#5abcd8", "#74ccf4", "#49e8ff"];
  let randomColor = Math.floor(Math.random() * 5);
  let color = warmColors[randomColor];
  currentPixel.css("background", color);
}

// rainbow color
function rainbowColor(currentPixel) {
  let randomColor = Math.floor(Math.random() * 255) + 1;
  currentPixel.css("background-color", `hsl(${randomColor},100%,50%)`);
}
// gray scale
function grayScale(currentPixel) {
  let background = currentPixel.css("background-color");
  let opacity = background.split(" ")[3];
  let opacityNumber = parseFloat(opacity);

  if (opacityNumber === 0) {
    currentPixel.css("background-color", "rgba(0,0,0,0.1)");
  } else if (opacityNumber >= 0.1 && opacityNumber <= 0.9) {
    currentPixel.css("background-color", `rgba(0,0,0,${opacityNumber + 0.1})`);
  } else {
    // currentPixel.css("background-color", `rgba(0,0,0,${0.1})`)
  }
}

// clear
function clear() {
  $("#canvas div").css("background-color", "rgba(0,0,0,0)");
}

function delegatedDrawOnHover(e) {
  if (e.target.classList.contains("pixel") && isMouseDrawing) {
    drawOnHover(e);
  }
}

function activateMouseMode() {
  drawingMode = "mouse";
  isMouseDrawing = false;
  //disable drawing with arrows
  document.removeEventListener("keydown", handleArrowPress);
  canvas.removeEventListener("focusin", delegatedDrawWithArrows);
}

function activateArrowsMode() {
  drawingMode = "arrows";

  // listen to key press on document
  document.addEventListener("keydown", handleArrowPress);
  // listen to focus on the canvas
  canvas.addEventListener("focusin", delegatedDrawWithArrows);
}

function pointerDownHandler(e) {
  if (drawingMode !== "mouse") return;
  if (e.button !== 0) return;
  e.preventDefault();
  isMouseDrawing = true;
}
function pointerUpHandler(e) {
  isMouseDrawing = false;
}
function delegatedDrawWithArrows(e) {
  if (e.target.classList.contains("pixel")) {
    fillPixelOnFocus(e);

    //capture the pixel and get the grid size to calculate the above and bellow relitave pixels
    let numberOfcolumns = parseInt(
      canvas.style.gridTemplateColumns.match(/\d+/)[0],
    );

    buttomPixel = parseInt(e.target.tabIndex) + numberOfcolumns;
    topPixel = parseInt(e.target.tabIndex) - numberOfcolumns;
  }
}

function fillPixelOnFocus(e) {
  setColor(e.target);
}

// focus on the correct pixel when arrows pressed
function handleArrowPress(e) {
  const focusedPixel = document.activeElement;
  if (focusedPixel && focusedPixel.classList.contains("pixel")) {
    if (e.key === "ArrowRight" && focusedPixel.nextElementSibling) {
      focusedPixel.nextElementSibling.focus();
    } else if (e.key === "ArrowLeft" && focusedPixel.previousElementSibling) {
      focusedPixel.previousElementSibling.focus();
    }

    if (e.key === "ArrowUp") {
      const upperPixel = document.querySelector(`div[tabindex="${topPixel}"]`);

      upperPixel && upperPixel.focus();
    } else if (e.key === "ArrowDown") {
      const lowerPixel = document.querySelector(
        `div[tabindex="${buttomPixel}"]`,
      );

      lowerPixel && lowerPixel.focus();
    }
  }
}
