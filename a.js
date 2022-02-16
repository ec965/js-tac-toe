function drawBoard(ctx) {
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100,0);
  ctx.lineTo(100, 300);
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 300);
  ctx.moveTo(0, 100);
  ctx.lineTo(300, 100);
  ctx.moveTo(0, 200);
  ctx.lineTo(300, 200);
  ctx.closePath();
  ctx.stroke();
}

const draw = {
  A: (turn, ctx) => ctx.strokeText(turn, 33, 66, 100),
  B: (turn, ctx) => ctx.strokeText(turn, 133, 66, 100),
  C: (turn, ctx) => ctx.strokeText(turn, 233, 66, 100),
  D: (turn, ctx) => ctx.strokeText(turn, 33, 166, 100),
  E: (turn, ctx) => ctx.strokeText(turn, 133, 166, 100),
  F: (turn, ctx) => ctx.strokeText(turn, 233, 166, 100),
  G: (turn, ctx) => ctx.strokeText(turn, 33, 266, 100),
  H: (turn, ctx) => ctx.strokeText(turn, 133, 266, 100),
  I: (turn, ctx) => ctx.strokeText(turn, 233, 266, 100),
}

function drawBoardState(ctx, state, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard(ctx);
  Object.entries(state).forEach(([position, player]) => {
    if (!player) {
      draw[position](position, ctx);
    }
    else {
      draw[position](player, ctx);
    }
  });
}

function getTurn(value, ctx, turn, state, canvas) {
  state[value] = turn;
  drawBoardState(ctx, state, canvas);
}

function between(lower, num, upper) {
  return lower <= num && num <= upper;
}

function processCanvasClick(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (between(0, y, 99)) {
    if (between(0, x, 99)) {
      return 'A';
    } else if (between(99, x, 199)) {
      return 'B';
    } else if (between(199, x, 299)) {
      return 'C';
    }
  }

  if (between(99, y, 199)) {
    if (between(0, x, 99)) {
      return 'D';
    } else if (between(99, x, 199)) {
      return 'E';
    } else if (between(199, x, 299)) {
      return 'F';
    }
  }

  if (between(199, y, 299)) {
    if (between(0, x, 99)) {
      return 'G';
    } else if (between(99, x, 199)) {
      return 'H';
    } else if (between(199, x, 299)) {
      return 'I';
    }
  }

  return e;
}

function didWin(state, turn) {
  const values = Object.values(state).map((val) => val === turn);
  return (
    // horizontals
    (values[0] && values[1] && values[2]) ||
    (values[3] && values[4] && values[5]) ||
    (values[6] && values[7] && values[8]) ||
    // verticals
    (values[0] && values[3] && values[6]) ||
    (values[1] && values[4] && values[7]) ||
    (values[2] && values[5] && values[7]) ||
    // diagonals
    (values[0] && values[4] && values[8]) ||
    (values[2] && values[4] && values[6])
  );
}



/*
A | B | C
D | E | F
G | H | I
*/

function main() {
  const canvas = document.getElementById("root");
  const currentTurn = document.getElementById('currentTurn');
  const message = document.getElementById('message');
  currentTurn.innerHTML= "X";

  const ctx = canvas.getContext('2d');
  ctx.font = '50px sans-serif'
  const state = Object.keys(draw).reduce((state, position) => {
    state[position] = '';
    return state;
  }, {});
  drawBoardState(ctx, state, canvas);

  const clickPlayTurn = (e) => {
    const val = processCanvasClick(e);
    if (state[val]) {
      return;
    }
    getTurn(val, ctx, currentTurn.innerHTML, state, canvas);
    if (didWin(state, currentTurn.innerHTML)){
      message.innerHTML = currentTurn.innerHTML + ' won!'
      currentTurn.innerHTML = '';
      canvas.removeEventListener('click', clickPlayTurn);
      return;
    };
    if (currentTurn.innerHTML === 'X') {
      currentTurn.innerHTML = 'O';
    } else {
      currentTurn.innerHTML = 'X';
    }
  }

  canvas.addEventListener('click', clickPlayTurn);
}

main();
