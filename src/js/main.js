function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `0:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(1, '0')}`;
}

function getRandomTitle() {
    const titles = ['GM', 'IM', 'FM', 'NM'];
    return titles[Math.floor(Math.random() * titles.length)];
}

function createChessboard(number, whiteAdvantage) {
    const isSingle = document.getElementById('singleChessBoard') !== null;
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1]; // bottom is 1
    const col = document.createElement('div');
    col.className = isSingle
        ? 'col-12 text-center' // full width
        : 'col-6 col-lg-3 text-center'; // default (2 per row mobile, 4 desktop)

    const container = document.createElement('div');
    container.className = 'chessboard-container';

    const playerTop = document.createElement('div');
    playerTop.className = 'player-info p-1 p-md-2';
    const titleTop = getRandomTitle();
    playerTop.innerHTML = isSingle
        ? `
        <div class="d-flex align-items-center justify-content-between gap-2 w-100 p-2">
            <span class="player-name">Player Name</span>
            <div class="d-flex bg-black px-3 py-1 rounded-3">
              <span class="player-score">1</span>-<span class="player-score">0</span>
            </div>
            <span class="player-name">Player Name</span>
        </div>
        
    `
        : `
        <div class="d-flex align-items-center gap-2">
          ${
              titleTop
                  ? `<span class="player-rank">${titleTop}</span>
          <span class="player-name">Player ${number * 2 - 1}</span>`
                  : ''
          }
        </div>
        <span class="player-time">${formatTime(Math.floor(Math.random() * 600))}</span>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'chessboard-wrapper';

    const barContainer = document.createElement('div');
    barContainer.className = 'advantage-bar';

    const fill = document.createElement('div');
    fill.className = 'advantage-fill';
    fill.style.height = `${whiteAdvantage}%`;

    const label = document.createElement('div');
    label.className = 'advantage-label';
    label.textContent = `${whiteAdvantage}%`;

    barContainer.appendChild(fill);
    barContainer.appendChild(label);

    const board = document.createElement('div');
    board.className = 'chess-board';
    for (let row = 0; row < 8; row++) {
        for (let colIndex = 0; colIndex < 8; colIndex++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((row + colIndex) % 2 === 0 ? 'light' : 'dark');

            // Rank numbers (1-8) on LEFT side — top-left of square
            if (colIndex === 0) {
                const rankLabel = document.createElement('span');
                rankLabel.className = 'rank-label';
                rankLabel.textContent = ranks[row];
                square.appendChild(rankLabel);
            }

            // File letters (a-h) on BOTTOM row — bottom-right of square
            if (row === 7) {
                const fileLabel = document.createElement('span');
                fileLabel.className = 'file-label';
                fileLabel.textContent = files[colIndex];
                square.appendChild(fileLabel);
            }

            board.appendChild(square);
        }
    }

    if (!isSingle) {
        wrapper.appendChild(barContainer);
    }

    wrapper.appendChild(board);

    // Player bottom (Black)
    const playerBottom = document.createElement('div');
    playerBottom.className = 'player-info p-1 p-md-2';
    const titleBottom = getRandomTitle();
    playerBottom.innerHTML = isSingle
        ? `
        <div class="d-flex align-items-center justify-content-between gap-2 w-100 p-2">
            <div class="icon-container d-flex gap-2 w-100 justify-content-evenly"></div>
        </div>
        
    `
        : `
        <div class="d-flex align-items-center gap-2">
          ${
              titleTop
                  ? `<span class="player-rank">${titleTop}</span>
          <span class="player-name">Player ${number * 2 - 1}</span>`
                  : ''
          }
        </div>
        <span class="player-time">${formatTime(Math.floor(Math.random() * 600))}</span>
    `;

    container.appendChild(playerTop);
    container.appendChild(wrapper);
    container.appendChild(playerBottom);
    col.appendChild(container);

    return col;
}

// Render boards for both divisions
function renderBoards(containerId, count = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 1; i <= count; i++) {
        const randomAdvantage = Math.floor(Math.random() * 100);
        container.appendChild(createChessboard(i, randomAdvantage));
    }
}

renderBoards('chessBoardsNorth');
renderBoards('chessBoardsSouth');
renderBoards('singleChessBoard', 1);
renderBoards('singleChessBoardSouth', 1);

const svgFiles = [
    '../assets/svg/media-player-ui-button-rewind.svg',
    '../assets/svg/media-player-ui-button-prev.svg',
    '../assets/svg/media-player-ui-button-play.svg',
    '../assets/svg/media-player-ui-button-next.svg',
    '../assets/svg/media-player-ui-button-fastforward.svg',
    '../assets/svg/media-player-ui-button-repeat.svg',
];

function renderMediaIcons() {
    const containers = document.querySelectorAll('.icon-container');

    containers.forEach((container) => {
        container.innerHTML = ''; // clear existing content
        let isPlaying = false;

        const setSvgSize = (svgEl, maxWidth) => {
            svgEl.removeAttribute('width');
            svgEl.removeAttribute('height');
            svgEl.setAttribute('width', maxWidth);
            svgEl.setAttribute('height', maxWidth);
        };

        const updateButtonColors = () => {
            container.querySelectorAll('.svg-wrapper').forEach((wrapper, index) => {
                const svgEl = wrapper.querySelector('svg');
                let active = true;
                if (!isPlaying && [1, 3, 4].includes(index)) active = false;
                svgEl.querySelectorAll('path, circle, line, rect, polygon, polyline').forEach((el) => {
                    const color = active ? '#000' : '#b0b0b0';
                    el.setAttribute('fill', color);
                    el.setAttribute('stroke', color);
                    el.setAttribute('stroke-width', '0');
                });
            });
        };

        const createButton = (svgText, maxWidth, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('svg-wrapper');
            wrapper.innerHTML = svgText;

            const svgEl = wrapper.querySelector('svg');
            setSvgSize(svgEl, maxWidth);

            if (svgFiles[index].includes('play')) {
                wrapper.classList.add('play-button');
                wrapper.addEventListener('click', () => {
                    isPlaying = !isPlaying;
                    updateButtonColors();
                });
            }

            return wrapper;
        };

        Promise.all(svgFiles.map((file) => fetch(file).then((res) => res.text())))
            .then((svgs) => {
                svgs.forEach((svg, index) => {
                    const button = createButton(svg, 20, index);
                    container.appendChild(button);

                    if (index < svgs.length - 1) {
                        const divider = document.createElement('div');
                        divider.classList.add('svg-divider');
                        container.appendChild(divider);
                    }
                });

                updateButtonColors();

                Array.from(container.children).forEach((item) => {
                    if (!item.classList.contains('svg-divider')) item.style.flexGrow = 1;
                    else item.style.margin = '0 5px';
                });
            })
            .catch((err) => console.error('Error loading SVGs:', err));
    });
}

// Run after DOM is ready
window.addEventListener('load', renderMediaIcons);

// Resize handler
window.addEventListener('resize', () => {
    document.querySelectorAll('.icon-container svg').forEach((svgEl, index) => {
        const maxWidth = svgFiles[index % svgFiles.length].includes('play') ? 40 : 30;
        svgEl.setAttribute('width', maxWidth);
        svgEl.setAttribute('height', maxWidth);
    });
});

function syncContainerHeights() {
    const rows = document.querySelectorAll('.chessboard-row');

    rows.forEach((row) => {
        const liveGame = row.querySelector('.live-game-container');
        const chessboard = row.querySelector('.chessboard-wrapper');
        const moves = row.querySelector('.moves-container');

        if (!chessboard) return;

        const height = chessboard.offsetHeight;

        if (liveGame) liveGame.style.height = `${height}px`;
        if (moves) moves.style.height = `${height}px`;
    });
}

// Run after rendering
window.addEventListener('load', syncContainerHeights);
window.addEventListener('resize', syncContainerHeights);

const standingsData = {
    1: {
        // SEASON 1
        conference1: {
            northern: [
                { rank: 1, team: 'San Juan Predators', logo: '../assets/img/san_juan_predators_logo.png', w: 11, l: 1, score: 350 },
                { rank: 2, team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', w: 9, l: 3, score: 300 },
            ],
            southern: [
                { rank: 1, team: 'Camarines Soaring Eagles', logo: '../assets/img/camarines_soaring_eagles_logo.png', w: 11, l: 1, score: 350 },
                { rank: 2, team: 'Iloilo Kisela Knights', logo: '../assets/img/iloilo_kisela_knights_logo.png', w: 9, l: 3, score: 300 },
            ],
        },
        conference2: {
            northern: [
                { rank: 1, team: 'Pasig City King Pirates', logo: '../assets/img/pasig_city_king_pirates_logo.png', w: 11, l: 1, score: 350 },
                { rank: 2, team: 'Isabela Knights Of Alexander', logo: '../assets/img/isabela_knights_of_alexander_logo.png', w: 9, l: 3, score: 300 },
            ],
            southern: [
                { rank: 1, team: 'Toledo-Xignex Trojans', logo: '../assets/img/toledo_xignex_trojans_logo.png', w: 11, l: 1, score: 350 },
                { rank: 2, team: 'Surigao Fianchetto Checkmates', logo: '../assets/img/surigao_fianchetto_checkmates_logo.png', w: 9, l: 3, score: 300 },
            ],
        },
        conference3: {
            northern: [
                { rank: 1, team: 'Laguna-PECA', logo: '../assets/img/laguna_heroes_logo.png', w: 11, l: 1, score: 350 },
                { rank: 2, team: 'AQ Prime Cavite Spartans', logo: '../assets/img/aq_prime_cavite_spartans_logo.png', w: 9, l: 3, score: 300 },
            ],
            southern: [
                { rank: 1, team: 'Iriga Oragons', logo: '../assets/img/iriga_oragons_logo.png', w: 11, l: 1, score: 350 },
                { rank: 2, team: 'Davao Chess Eagles', logo: '../assets/img/davao_chess_eagles_logo.png', w: 9, l: 3, score: 300 },
            ],
        },
        conference4: {
            northern: [
                { rank: 1, team: 'Magic Mandaluyong Tigers', logo: '../assets/img/magic_mandaluyong_tigers_logo.png', w: 11, l: 1, score: 350 },
                { rank: 2, team: 'Rizal Batch Towers', logo: '../assets/img/rizal_batch_towers_logo.png', w: 9, l: 3, score: 300 },
            ],
            southern: [
                { rank: 1, team: 'TFCC LP Bamboo Knights', logo: '../assets/img/tfcc_lp_bamboo_knights_logo.png', w: 11, l: 1, score: 350 },
                { rank: 2, team: 'Tacloban Vikings', logo: '../assets/img/tacloban_vikings_logo.png', w: 9, l: 3, score: 300 },
            ],
        },
    },

    2: {
        // SEASON 2
        conference1: {
            northern: [],
            southern: [
                /* rows */
            ],
        },
        conference2: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
        conference3: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
        conference4: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
    },

    3: {
        /* SEASON 3 */
        conference1: {
            northern: [],
            southern: [
                /* rows */
            ],
        },
        conference2: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
        conference3: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
        conference4: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
    },

    4: {
        /* SEASON 4 */
        conference1: {
            northern: [],
            southern: [
                /* rows */
            ],
        },
        conference2: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
        conference3: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
        conference4: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
    },

    5: {
        /* SEASON 5 */
        conference1: {
            northern: [],
            southern: [
                /* rows */
            ],
        },
        conference2: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
        conference3: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
        conference4: {
            northern: [
                /* rows */
            ],
            southern: [
                /* rows */
            ],
        },
    },
};

// Sample stats data
const statsData = {
    1: {
        conference1: [
            { rank: 1, player: 'Ochoa, Karl Victor', team: 'San Juan Predators', logo: '../assets/img/san_juan_predators_logo.png', win: 36, draw: 6, loss: 2, total: 58 },
            { rank: 2, player: 'Mejia, Cherry Ann', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
            { rank: 3, player: 'Mejia, Cherry Ann', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
            { rank: 4, player: 'Mejia, Cherry Ann', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
            { rank: 5, player: 'Mejia, Cherry Ann', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
            { rank: 6, player: 'Mejia, Cherry Ann', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
        ],
        conference2: [
            { rank: 1, player: 'Doe, Jane', team: 'Pasig City King Pirates', logo: '../assets/img/pasig_city_king_pirates_logo.png', win: 34, draw: 4, loss: 3, total: 52 },
            { rank: 2, player: 'Smith, John', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
            { rank: 2, player: 'Mejia, Cherry Ann', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
            { rank: 2, player: 'Mejia, Cherry Ann', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
            { rank: 2, player: 'Mejia, Cherry Ann', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
            { rank: 2, player: 'Mejia, Cherry Ann', team: 'Manila Load Manna Knights', logo: '../assets/img/manila_load_manna_knights_logo.png', win: 30, draw: 5, loss: 3, total: 50 },
        ],
    },
    2: {
        conference1: [],
        conference2: [],
    },
    3: {
        conference1: [],
        conference2: [],
    },
    4: {
        conference1: [],
        conference2: [],
    },
    5: {
        conference1: [],
        conference2: [],
    },
};

function updatePlayerTable(tbodyId, data) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return; // Safety check
    tbody.innerHTML = '';

    data.forEach((row) => {
        tbody.innerHTML += `
            <tr>
                <td class="td-rank">${row.rank}</td>
                <td>${row.player}</td>
                <td>
                    <div class="d-flex justify-content-center align-items-center gap-2">
                        <img src="${row.logo}" style="width:24px;height:24px;">
                        <span>${row.team}</span>
                    </div>
                </td>
                <td>${row.win}</td>
                <td>${row.draw}</td>
                <td>${row.loss}</td>
                <td>${row.total}</td>
            </tr>
        `;
    });
}

function updateTable(tbodyId, rows) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '';

    rows.forEach((row) => {
        tbody.innerHTML += `
            <tr>
                <td>${row.rank}</td>
                <td>
                    <div class="team d-flex justify-content-start align-items-center gap-2 gap-md-3">
                        <img src="${row.logo}" style="height:24px;width:24px;">
                        <span>${row.team}</span>
                    </div>
                </td>
                <td>${row.w}</td>
                <td>${row.l}</td>
                <td>${row.score}</td>
            </tr>
        `;
    });
}

function updatePlayerTable(tbodyId, data) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '';

    data.forEach((row) => {
        tbody.innerHTML += `
            <tr>
                <td class="td-rank">${row.rank}</td>
                <td>${row.player}</td>
                <td>
                    <div class="team d-flex justify-content-start align-items-center gap-2 gap-md-3">
                        <img src="${row.logo}" style="width:24px;height:24px;">
                        <span>${row.team}</span>
                    </div>
                </td>
                <td>${row.win}</td>
                <td>${row.draw}</td>
                <td>${row.loss}</td>
                <td>${row.total}</td>
            </tr>
        `;
    });
}

function updateAllConferences(season) {
    // Conference 1
    updateTable('northern-table-body-c1', standingsData[season].conference1.northern);
    updateTable('southern-table-body-c1', standingsData[season].conference1.southern);

    // Conference 2
    updateTable('northern-table-body-c2', standingsData[season].conference2.northern);
    updateTable('southern-table-body-c2', standingsData[season].conference2.southern);

    // Conference 3
    updateTable('northern-table-body-c3-elimination', standingsData[season].conference3.northern);
    updateTable('southern-table-body-c3-elimination', standingsData[season].conference3.southern);

    // Conference 4
    updateTable('northern-table-body-c2-elimination', standingsData[season].conference4.northern);
    updateTable('southern-table-body-c2-elimination', standingsData[season].conference4.southern);
}

// Function to update all conferences for a season
function updateAllPlayerConferences(season) {
    updatePlayerTable('players-conf1', statsData[season].conference1 || []);
    updatePlayerTable('players-conf2', statsData[season].conference2 || []);
    // Add more conferences if needed: conf3, conf4...
}

// Season button logic
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    updateAllPlayerConferences(1);

    // Add click events
    document.querySelectorAll('.season-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            // Update active button
            document.querySelectorAll('.season-btn').forEach((b) => b.classList.remove('active'));
            document.querySelectorAll('.season-btn').forEach((b) => b.classList.add('inactive'));
            this.classList.remove('inactive');
            this.classList.add('active');

            // Get season
            const season = this.dataset.season;
            updateAllPlayerConferences(season);
        });
    });
});

document.querySelectorAll('.season-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
        // make all inactive
        document.querySelectorAll('.season-btn').forEach((b) => {
            b.classList.remove('active');
            b.classList.add('inactive');
        });

        // activate clicked
        this.classList.remove('inactive');
        this.classList.add('active');

        const season = this.dataset.season;

        // update all 8 tables
        updateAllConferences(season);
    });
});

// Initial load (choose your default)
updateAllConferences(1);

document.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('focus', () => {
        field.setAttribute('data-placeholder', field.getAttribute('placeholder'));
        field.setAttribute('placeholder', '');
    });
    field.addEventListener('blur', () => {
        if (!field.value) {
            field.setAttribute('placeholder', field.getAttribute('data-placeholder'));
        }
    });
});

const input = document.querySelector('.search-team-name-input');

input.addEventListener('blur', () => {
    input.value = ''; // Clear typed text when input loses focus
});
