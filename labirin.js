const DIR_PRIORITY = "URDL";
const DIR_LABEL = ["ATAS", "KANAN", "BAWAH", "KIRI"];
const DIR_ROW_ACTION = [-1, 0, 1, 0];
const DIR_COL_ACTION = [0, 1, 0, -1];

const rightWays = [];
let currentPath = "";

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
   if (row === MAPS_HEIGHT - 1 && col === MAPS_WIDTH - 1) {
      rightWays.push(currentPath);
      return;
   }

   maps[row][col] = 0;

   for (let i = 0; i < 4; i++) {
      const nextRow = row + DIR_ROW_ACTION[i];
      const nextCol = col + DIR_COL_ACTION[i];

      if (isValidWay(nextRow, nextCol)) {
         currentPath += DIR_PRIORITY[i];
         findWay(nextRow, nextCol);
         currentPath = currentPath.slice(0, -1);
      }
   }

   maps[row][col] = 1;
   if (row === 8 && col === 4) {
      console.info(maps)
   }
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
   for (let i = 0; i < rightWays.length; i++) {
      const rightWaysEl = document.createElement("p");
      rightWaysEl.innerHTML = `${i + 1}. ${convertPath(rightWays[i])}`;
   }
} else {
   console.error("Format maps tidak valid")
}

