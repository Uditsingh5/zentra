const socketMap = new Map();

export const setUserSocket = (userId, socketId) => {
  socketMap.set(userId, socketId);
}
export const getUserSocket = (userId) => {
  return socketMap.get(userId);
}
export const removeUserSocket = (userId) => {
  socketMap.delete(userId);
}