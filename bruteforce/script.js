const DIR_PRIORITY = "URDL";
const DIR_LABEL = ["ATAS", "KANAN", "BAWAH", "KIRI"];
const DIR_ROW_ACTION = [-1, 0, 1, 0];
const DIR_COL_ACTION = [0, 1, 0, -1];

let currentPath = "";
const rightWays = [];
let simpulDaunCount = 0;

let maps = [
   [1, 0, 0, 0, 0, 0],
   [1, 0, 1, 1, 1, 0],
   [1, 1, 1, 0, 1, 0],
   [0, 0, 0, 0, 1, 0],
   [1, 1, 1, 1, 1, 0],
   [0, 1, 0, 0, 0, 0],
   [0, 1, 1, 1, 0, 0],
   [0, 0, 0, 1, 0, 0],
   [0, 1, 1, 1, 1, 0],
   [0, 1, 0, 0, 0, 0],
   [1, 1, 1, 1, 1, 0],
   [0, 1, 0, 0, 0, 0],
   [0, 1, 1, 1, 1, 0],
   [0, 0, 1, 0, 1, 0],
   [0, 0, 1, 1, 1, 1],
];

const MAPS_WIDTH = maps[0].length;
const MAPS_HEIGHT = maps.length;

function isValidWay(row, col) {
   return (row >= 0 && col >= 0) && (row < MAPS_HEIGHT && col < MAPS_WIDTH) && (maps[row][col] == 1);
}

function findWay(row, col) {
   // cek apakah dia cell pintu keluar
   if (row === MAPS_HEIGHT - 1 && col === MAPS_WIDTH - 1) {
      rightWays.push(currentPath);
      simpulDaunCount++;
      return true;
   }

   // cek apakah dia bukan jalan yg benar
   if (!isValidWay(row, col)) {
      simpulDaunCount++;
      return false;
   }

   // tandain bahwa jalan sekarang udah dia lewatin
   maps[row][col] = 0;

   // inisialisasi untuk cek apakah cell saat ini simpul daun
   let isSimpulDaun = true;

   // tengok semua arah (atas, kanan, bawah, kiri)
   for (let i = 0; i < 4; i++) {
      // tampung posisi next row & next col dari cell sekarang berdasar prioritas yg dibuat
      const nextRow = row + DIR_ROW_ACTION[i];
      const nextCol = col + DIR_COL_ACTION[i];

      // tambahkan semua arah yg akan dicoba
      currentPath += DIR_PRIORITY[i];

      // secara recursive, iterasi lagi sampai menemukan pintu keluar
      const isFindWay = findWay(nextRow, nextCol);

      // gerakin tikus nya
      moveMouse(nextRow, nextCol);

      // kalau menemukan jalan artinya dia punya anak artinya dia bukan simpul daun
      if (isFindWay) {
         isSimpulDaun = false;
      }

      // callback rekursif potong 1 huruf paling belakang (index -1) dari currentPath
      currentPath = currentPath.slice(0, -1);
   }

   // kalau isSimpulDaun masih true
   if (isSimpulDaun) {
      // tambah jumlah simpul daun
      simpulDaunCount++;
   }

   return false;
}

function convertPath(path) {
   if (path.length === 0) return "";

   let result = [];
   let count = 1;
   for (let i = 1; i <= path.length; i++) {
      if (i < path.length && path[i] === path[i - 1]) {
         count++;
      } else {
         let directionName = DIR_LABEL[DIR_PRIORITY.indexOf(path[i - 1])];
         result.push(`${count} ${directionName}`);
         count = 1;
      }
   }
   return result.join(", ");
}

let mouseElement = null;

function updateCellColor(row, col) {
   const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
   cell?.classList?.add("visited");
}

function moveMouse(row, col) {
   const cellWidth = 50;
   const cellHeight = 50;

   const x = col * cellWidth + cellWidth / 2;
   const y = row * cellHeight + cellHeight / 2;

   mouseElement.style.transform = `translate(${x}px, ${y}px)`;
   updateCellColor(row, col);
}

document.addEventListener("DOMContentLoaded", () => {
   const mapsContainer = document.getElementById("maps-container");
   mapsContainer.style.setProperty("--cols", MAPS_WIDTH);
   mapsContainer.style.setProperty("--rows", MAPS_HEIGHT);

   const runBtn = document.getElementById("run-btn");

   for (let row = 0; row < MAPS_HEIGHT; row++) {
      for (let col = 0; col < MAPS_WIDTH; col++) {
         const cell = document.createElement("div");
         cell.classList.add("cell");
         cell.setAttribute("data-row", row);
         cell.setAttribute("data-col", col);
         if (maps[row][col] === 0) {
            cell.style.backgroundColor = "black";
         } else if (row === 0 && col === 0) {
            cell.classList.add("start");
         } else if (row === MAPS_HEIGHT - 1 && col === MAPS_WIDTH - 1) {
            cell.classList.add("end");
         }
         mapsContainer.appendChild(cell);
      }
   }

   mouseElement = document.createElement("div");
   mouseElement.classList.add("mouse");
   mapsContainer.appendChild(mouseElement);

   runBtn.addEventListener("click", () => {
      if (maps[0][0] !== 0 && maps[MAPS_HEIGHT - 1][MAPS_WIDTH - 1] !== 0) {
         const startTime = performance.now();
         simpulDaunCount = 0;
         findWay(0, 0);
         const endTime = performance.now();
         const executionTime = (endTime - startTime).toFixed(2);

         const resultInfoContainer = document.getElementById('result-info');

         const execTimeEl = document.createElement("p");
         execTimeEl.innerHTML = `Waktu eksekusi: ${executionTime} ms`;
         const simpulDaunEl = document.createElement("p");
         simpulDaunEl.innerHTML = `Jumlah simpul daun yang dieksplorasi: ${simpulDaunCount}`;

         resultInfoContainer.appendChild(execTimeEl)
         resultInfoContainer.appendChild(simpulDaunEl)
         console.info(rightWays)
         for (let i = 0; i < rightWays.length; i++) {
            const rightWaysEl = document.createElement("p");
            rightWaysEl.innerHTML = `${i + 1}. ${convertPath(rightWays[i])}`;
            resultInfoContainer.appendChild(rightWaysEl)

         }
      } else {
         console.error("Format maps tidak valid");
      }
   });
});