const { trimStr } = require('../utils');
const { addUser, getUsers, findUser, getRoomUsers, removeUser, resetUsers } = require('../users');


describe('Users', () => {
    beforeEach(() => {
        resetUsers();
    });

    test('should add a user', () => {
        const user = { name: 'Bob', room: 'Room 1' };
        const { isExist } = addUser(user);

        expect(isExist).toBe(false);
        expect(getUsers()).toContainEqual(user);
    });

    test('should not add the same user', () => {
        const user = { name: 'Bob', room: 'Room 1' };
        addUser(user);
        const result = addUser(user);

        expect(result.isExist).toBe(true);
        expect(result.user).toEqual(user);
        expect(getUsers().length).toBe(1);
    });

    test('should find a user by name and room', () => {
        const user = { name: 'John', room: 'Room 1' };
        addUser(user);
        const foundUser = findUser({ name: 'John', room: 'Room 1' });

        expect(foundUser).toEqual(user);
    });

    test('should return undefined when user is not found', () => {
        const user = { name: 'Anna', room: 'Room 1' };
        addUser(user);
        const foundUser = findUser({ name: 'Bob', room: 'Room 1' });

        expect(foundUser).toBeUndefined();
    });

    test('should get users in a room', () => {
        addUser({ name: 'Johny', room: 'Room 1' });
        addUser({ name: 'Bob', room: 'Room 1' });
        addUser({ name: 'John', room: 'Room 2' });

        const roomUsers = getRoomUsers('Room 1');
        expect(roomUsers).toEqual([
            { name: 'Johny', room: 'Room 1' },
            { name: 'Bob', room: 'Room 1' }
        ]);
    });

    test('should remove a user', () => {
        const user = { name: 'John', room: 'Room 1' };
        addUser(user);
        removeUser(user);

        expect(getUsers()).not.toContainEqual(user);
    });
});
