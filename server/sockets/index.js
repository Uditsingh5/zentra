import { setUserSocket, removeUserSocket} from "./socketMap.js";
import handleCommentEvents from "./handleCommentEvents.js";
import handleLikeEvents from "./handleLikeEvents.js";
import handleFollowEvents from "./handleFollowEvents.js";

const socketSetup = (io) => {
  
  io.on("connection", (socket) => {

    const userId = socket.handshake.auth?.userId;
    if(!userId){
      console.log("❌ Unauthorized Socket is Rejected!");
      socket.disconnect();
      return;
    }

    setUserSocket(userId,socket.id);

    // Add test event listeners
    socket.on('test', (data) => {
      console.log('🧪 Test event received from client:', data);
    });

    socket.on('test-connection', (data) => {
      console.log('🔗 Test connection received from client:', data);
      socket.emit('test-response', { serverTime: Date.now(), received: data });
    });

    socket.on('ping', (data) => {
      console.log('🏓 Ping received from client:', data);
      socket.emit('pong', { serverTime: Date.now(), received: data });
    });

    // Socket HAndlers

    handleCommentEvents(io,socket);
    handleLikeEvents(io,socket);
    handleFollowEvents(io,socket);
    
    socket.on("disconnect", () => {
      removeUserSocket(userId);
      console.log("Client disconnected: ", + socket.id);
    });
})
}

export default socketSetup; 