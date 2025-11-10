import { setUserSocket, removeUserSocket} from "./socketMap.js";
import handleCommentEvents from "./handleCommentEvents.js";
import handleLikeEvents from "./handleLikeEvents.js";
import handleFollowEvents from "./handleFollowEvents.js";

const socketSetup = (io) => {
  
  io.on("connection", (socket) => {

    const userId = socket.handshake.auth?.userId;
    if(!userId){
      console.log("Unauthorized Socket is Rejected!");
      socket.disconnect();
      return;
    }

    setUserSocket(userId,socket.id);
    console.log("Client connected: ", + socket.id);

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