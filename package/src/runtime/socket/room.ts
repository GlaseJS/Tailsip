import { Payload } from "./payload.js";
import { sockets } from "./user.js";

class SocketRoom
{
  sockets: string[] = [];

  emit (from: string, event: string, data: JsonObject = {})
  {
    for (const socket in this.sockets)
    {
      // Skip Self
      if (socket == from) continue;
      // Skip obsolete
      if (!(socket in sockets))
      {
        this.leave(socket);
        continue;
      }

      sockets[socket].send(Payload(event, from, data));
    }
  }

  join (who: string, emit = Config.socket.roomAutoEmit)
  {
    if (who in this.sockets) return;
    
    this.sockets.push(who);
    if (emit) this.emit(who, "room:join");
  }

  leave (who: string, emit = Config.socket.roomAutoEmit)
  {
    if (!(who in this.sockets)) return;

    this.sockets.splice(this.sockets.indexOf(who), 1);
    if (emit) this.emit(who, "room:leave");
  }
}

export const rooms: {
  [x: string]: SocketRoom
} = {
  "/": new SocketRoom()
}

export const Room = (name: string) => {
  if (name in rooms) return rooms[name];

  const room = new SocketRoom;
  rooms[name] = room;
  return room;
}