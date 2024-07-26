export function getCurrentUser() {
    const currentUser = localStorage.getItem("CurrentPlayer");
    return JSON.parse(currentUser);
}


export function getAllUsers() {
    const allUsers = localStorage.getItem("userInfos");
    return JSON.parse(allUsers)
}

export function storeTheHighScore(score) {
    const user = getCurrentUser();
    const highScoreStored = user.HighScore;
    console.log(highScoreStored);
    if (highScoreStored>score) return;
    const allUsers = getAllUsers();
    const currentUser = allUsers.filter(u=>{
        return u.userName == user.userName;});
    currentUser[0]["HighScore"] = score;
    const index = allUsers.indexOf(currentUser[0])
    allUsers.splice(index, 1);
    allUsers.push(currentUser[0]);
    localStorage.setItem("CurrentPlayer",JSON.stringify( currentUser[0]));
    localStorage.setItem("userInfos", JSON.stringify(allUsers));
}
function constructLeaderBoard(sortedUsers) {
    const leaderBoard = document.createElement('div');
    leaderBoard.className = 'leaderboard';
    const title = document.createElement('h2');
    title.textContent = 'Leaderboard';
    leaderBoard.appendChild(title);
    const table = document.createElement('table');
    table.className = 'leaderboard-table';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Rank', 'Username', 'High Score'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    sortedUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        const usernameCell = document.createElement('td');
        usernameCell.textContent = user.userName;
        row.appendChild(usernameCell);

        const scoreCell = document.createElement('td');
        scoreCell.textContent = user.HighScore;
        row.appendChild(scoreCell);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    leaderBoard.appendChild(table);

    return leaderBoard;
}



export function getTheLeaderBoard() {
    let allUsers = JSON.parse(localStorage.getItem("userInfos"));
    allUsers = allUsers.sort((a, b) => b.HighScore - a.HighScore);
    return constructLeaderBoard(allUsers);
}