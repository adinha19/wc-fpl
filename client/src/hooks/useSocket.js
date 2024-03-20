import { useState, useEffect } from "react";
import io from "socket.io-client";

const useSocket = (url, leagueId) => {
  const [data, setData] = useState(null);
  const uuid = Math.random().toString(36);
  const roomId = `${leagueId}-${uuid}`;

  useEffect(() => {
    const socket = io(url);

    socket.on("connect", () => {
      socket.emit("joinRoom", roomId);
    });

    socket.on("currentLeagueStanding", (data) => {
      if (data) setData(data);
    });

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [url, leagueId]);

  return { data };
};

export default useSocket;
