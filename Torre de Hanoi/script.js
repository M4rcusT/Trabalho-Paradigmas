const towers = [[], [], []];
const MAX_DISKS = 7;
const MIN_DISKS = 3;
let numDisks = MIN_DISKS;
let selectedDisk = null;
let sourceTower = null;
let gameWon = false;
let attempts = 0;

function init() {
    document.querySelectorAll('.disk').forEach(disk => disk.remove());
    towers.forEach(tower => tower.length = 0);
    gameWon = false;
    attempts = 0;
    updateInfo();
    selectedDisk = null;
    sourceTower = null;
    document.querySelectorAll('.disk').forEach(disk => {
        disk.style.backgroundColor = disk.dataset.originalColor;
    });
}

function createDisks() {
    for (let i = numDisks - 1; i >= 0; i--) {
        const disk = document.createElement('div');
        disk.className = 'disk';
        disk.style.width = `${(i + 1) * 30}px`;
        disk.style.bottom = `${(numDisks - i - 1) * 20}px`;

        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#34495e'];
        disk.style.backgroundColor = colors[i];
        disk.dataset.originalColor = colors[i];

        const number = document.createElement('span');
        number.className = 'disk-number';
        number.innerText = i + 1;
        disk.appendChild(number);

        towers[0].push(disk);
        document.getElementById('tower1').appendChild(disk);
    }
}

function moveDisk(from, to) {
    if (towers[from].length === 0 || gameWon) return;

    const disk = towers[from].pop();
    towers[to].push(disk);

    disk.style.bottom = `${(towers[to].length - 1) * 20}px`;

    const towerFrom = document.getElementById(`tower${from + 1}`);
    const towerTo = document.getElementById(`tower${to + 1}`);

    towerFrom.removeChild(disk);
    towerTo.appendChild(disk);
    attempts++;
    updateInfo();
}

function checkWin() {
    if (towers[2].length === numDisks && towers[2].every((disk, i) => parseInt(disk.style.width) === (numDisks - i) * 30)) {
        gameWon = true;
        setTimeout(() => {
            const message = `Parabéns! Você ganhou o jogo com ${numDisks} discos!`;
            const victoryMessage = document.createElement('div');
            victoryMessage.className = 'victory-message';
            victoryMessage.innerText = message;
            document.body.appendChild(victoryMessage);

            setTimeout(() => {
                document.getElementById('reset').click();
                victoryMessage.remove();
            }, 2000);
        }, 500);
    }
}

function handleTowerClick(towerIndex) {
    if (gameWon) return;

    if (selectedDisk === null) {
        if (towers[towerIndex].length === 0) return;

        selectedDisk = towers[towerIndex][towers[towerIndex].length - 1];
        sourceTower = towerIndex;

        selectedDisk.style.backgroundColor = 'yellow';
    } else {
        if (towers[towerIndex].length === 0 || parseInt(selectedDisk.style.width) < parseInt(towers[towerIndex][towers[towerIndex].length - 1].style.width)) {
            moveDisk(sourceTower, towerIndex);
            selectedDisk.style.backgroundColor = selectedDisk.dataset.originalColor;
            selectedDisk = null;
            checkWin();
        } else {
            alert('Você não pode colocar um disco maior sobre um disco menor.');
            selectedDisk.style.backgroundColor = selectedDisk.dataset.originalColor;
            selectedDisk = null;
        }
    }
}

function calculateMinAttempts(n) {
    return Math.pow(2, n) - 1;
}

function updateInfo() {
    document.getElementById('attempts').innerText = attempts;
    document.getElementById('minAttempts').innerText = calculateMinAttempts(numDisks);
    document.getElementById('attemptsBox').style.display = 'block';
    document.getElementById('minAttemptsBox').style.display = 'block';
}

document.getElementById('tower1').addEventListener('click', () => handleTowerClick(0));
document.getElementById('tower2').addEventListener('click', () => handleTowerClick(1));
document.getElementById('tower3').addEventListener('click', () => handleTowerClick(2));

document.getElementById('startGame').addEventListener('click', () => {
    numDisks = parseInt(document.getElementById('numDisks').value);
    if (numDisks < MIN_DISKS) {
        numDisks = MIN_DISKS;
    } else if (numDisks > MAX_DISKS) {
        numDisks = MAX_DISKS;
    }
    init();
    createDisks();
    document.getElementById('attemptsBox').style.display = 'block';
    document.getElementById('minAttemptsBox').style.display = 'block';
});

document.getElementById('reset').addEventListener('click', () => {
    init();
    createDisks();
});

document.getElementById('showSolution').addEventListener('click', () => {
    const solutionSteps = document.getElementById('solutionSteps');
    solutionSteps.innerHTML = '';

    const steps = getSolutionSteps(numDisks, 0, 2, 1);

    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.innerText = `Passo ${index + 1}: Disco ${step[0]} para a torre ${step[1] + 1}`;
        solutionSteps.appendChild(stepDiv);
    });

    document.getElementById('solutionModal').style.display = 'flex';
});

document.querySelector('.modal-content .close').addEventListener('click', () => {
    document.getElementById('solutionModal').style.display = 'none';
});

function getSolutionSteps(n, from, to, aux) {
    let steps = [];

    if (n === 1) {
        steps.push([1, to]);
        return steps;
    }

    steps = steps.concat(getSolutionSteps(n - 1, from, aux, to));
    steps.push([n, to]);
    steps = steps.concat(getSolutionSteps(n - 1, aux, to, from));

    return steps;
}
