import {createBoard, TILE_STATUSES, markTile, revealTile, checkWin, checkLose} from './minesweeper_script.js'

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 20;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector('.board');
const minesLeftText = document.querySelector('[data-mine-count]');
const messageText = document.querySelector('.text');

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener('click', () => {
            revealTile(board, tile);
            checkGameEnd();
        })
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        })
    })
})

boardElement.style.setProperty('--size', BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;

let lastTime;

function update(time)
{
    if(lastTime!=null)
    {
        const delta = time - lastTime;
        const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hue'));
        document.documentElement.style.setProperty('--hue', (hue+(delta*0.01)));
    }
    lastTime = time;
    window.requestAnimationFrame(update);
}

function listMinesLeft()
{
    const markedTilesCount = board.reduce((count, row) => {
        return (count+row.filter(tile => tile.status===TILE_STATUSES.MARKED).length);
    }, 0)
    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd()
{
    const win = checkWin(board);
    const lose = checkLose(board);
    if(win || lose)
    {
        boardElement.addEventListener('click', stopProp, {capture: true});
        boardElement.addEventListener('contextmenu', stopProp, {capture: true});
    }
    if(win)
    {
        messageText.textContent = '🎊You ✌(◠‿◠)✌ Win🎊';
    }
    if(lose)
    {
        messageText.textContent = '☠️You 🖕(ㅠ﹏ㅠ)🖕 Lose☠️';
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status===TILE_STATUSES.MARKED)
                {
                    markTile(tile);
                }
                if(tile.mine)
                {
                    revealTile(board, tile);
                }
            })
        })
    }
}

function stopProp(e)
{
    e.stopImmediatePropagation();
}

window.requestAnimationFrame(update);