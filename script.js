document.addEventListener("DOMContentLoaded", function () {
  window.color = "custom";
  window.isArrowsActive = false;
  createGrid();
  const drawingWithArrowsBtn = document.getElementById("arrows");
  const drawingWithMouseBtn = document.getElementById("hover");
  const canvas = document.getElementById("canvas");

  drawingWithArrowsBtn.addEventListener("click", arrowsBtnEventHandler);

  drawingWithMouseBtn.addEventListener("click", mouseBtnEventHandler);

  // resizing the grid event handler
  $(".slider").on("input", function () {
    let value = $(".slider").val();
    $(".size-value").text(`${value} x ${value}`);

    resizeGrid(value);
  });

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
function moveWhithArrows() {
  $(document).keydown(function (e) {
    if (e.keyCode == 39) {
      $(".pixel:focus").next().focus();
    }
    if (e.keyCode == 37) {
      $(".pixel:focus").prev().focus();
    }

    try {
      if (e.keyCode == 40) {
        $(`div[tabindex="${buttomPixel}"]`).focus();
      }
      if (e.keyCode == 38) {
        $(`div[tabindex="${topPixel}"]`).focus();
      }
    } catch (err) {
      if (err.name == "ReferenceError") {
        $("div[tabindex=0]").focus();
      }
    }
  });
}

// ============
function drawOnFocus(e) {
  let columns = $("#canvas").css("grid-Template-Columns").split(" ").length;
  window.thisPixel = e.target;
  window.buttomPixel = parseInt(e.target.getAttribute("tabindex")) + columns;
  window.topPixel = parseInt(e.target.getAttribute("tabindex")) - columns;
  setColor(thisPixel);
}

function drawOnHover(e) {
  setColor(e.target);
}

function activeArrows() {
  canvas.addEventListener("focusin", delegatedDrawWithArrows);
  if (isArrowsActive === false) {
    moveWhithArrows();
    isArrowsActive = true;
  }
}

// creat the grid
function createGrid(numder = 5) {
  const canvas = document.getElementById("canvas");

  let gridSize = numder * numder;
  let focusIndex = 0;
  for (let i = 1; i <= gridSize; i++) {
    let pixel = document.createElement("div");
    pixel.setAttribute("tabindex", `${focusIndex}`);
    pixel.className = "pixel";
    canvas.style.gridTemplateColumns = `repeat(${numder}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${numder}, 1fr)`;
    canvas.insertAdjacentElement("beforeend", pixel);
    focusIndex++;
  }
}

// resize the grid
function resizeGrid(value) {
  let pixels = canvas.querySelectorAll("div");
  pixels.forEach((pixel) => pixel.remove());
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
  if (e.target.classList.contains("pixel")) {
    drawOnHover(e);
  }
}

function delegatedDrawWithArrows(e) {
  console.log("focus triggred");
  if (e.target.classList.contains("pixel")) {
    drawOnFocus(e);
  }
}
function arrowsBtnEventHandler() {
  canvas.removeEventListener("mouseover", delegatedDrawOnHover);
  activeArrows();
}
function mouseBtnEventHandler() {
  canvas.addEventListener("mouseover", delegatedDrawOnHover);
  if (isArrowsActive === true) {
    $(document).off("keydown");
    isArrowsActive = false;
  }
}
