const users = [];

// Join user to chat
function userJoin(id, username, room) {
 const user = { id, username, room};

 users.push(user);

 return user;
}

// Get current User

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userLeavesChat(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) { // since the finindex function returns a -1 if it doesnt find the index
        return users.splice(index, 1)[0]; // just to return the user and not the whole array
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeavesChat,
    getRoomUsers
}