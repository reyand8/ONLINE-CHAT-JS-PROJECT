const {trimStr} = require('./utils');

let users = [];

const findUser = (user) => {
  const userName = trimStr(user.name);
  const roomName = trimStr(user.room);
  return users.find(
    (u) => trimStr(u.name) === userName && trimStr(u.room) === roomName);
};

const addUser = (user) => {
  const isExist = findUser(user);
  !isExist && users.push(user);
  const currentUser = isExist || user;
  return { isExist: !!isExist, user: currentUser };
};

const getRoomUsers = (room) => users.filter((u) => u.room === room);

const removeUser = (user) => {
  const correctUser = findUser(user);
  if (correctUser) {
    users = users.filter(
      ({ room, name }) => room === correctUser.room && name !== correctUser.name,
    );
  }
  return correctUser;
};

module.exports = { addUser, findUser, getRoomUsers, removeUser };