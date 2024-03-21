const cron = require("node-cron");
const axios = require("axios");

const gameWeeks = {};
const cronJobs = {};

const updateLeagueStandings = async (roomId) => {
  if (!gameWeeks[roomId]) {
    gameWeeks[roomId] = 0;
  }

  if (gameWeeks[roomId] > 28) {
    stopCronJob(roomId);

    return;
  }

  const gameWeek = gameWeeks[roomId];

  const room = roomId.split("-")[0];

  const apiUrl = `https://fantasy.premierleague.com/api/leagues-classic/${room}/standings/`;

  try {
    const response = await axios.get(apiUrl);
    const standingsData = response.data;

    const managers = standingsData.standings.results;
    const managerData = await Promise.all(
      managers.map(async (manager) => {
        const data = await axios
          .get(
            `https://fantasy.premierleague.com/api/entry/${manager.entry}/history/`
          )
          .then((res) => {
            const currentGameWeek = res.data.current[gameWeek];

            return { ...manager, ...currentGameWeek };
          })
          .catch((error) => {
            console.error("Error fetching manager data:", error.message);
          });
        return data;
      })
    );

    gameWeeks[roomId]++;

    return {
      leagueStadings: managerData.sort(
        (a, b) => b.total_points - a.total_points
      ),
      gameWeek: gameWeeks[roomId],
      leagueName: standingsData.league.name,
    };
  } catch (error) {
    console.error("Error fetching standings data:", error.message);
  }
};

function stopCronJob(roomId) {
  if (cronJobs[roomId]) {
    cronJobs[roomId].stop();
    delete cronJobs[roomId];
  }
}

function startCronJob(roomId, io) {
  cronJobs[roomId] = cron.schedule("*/3 * * * * *", async () => {
    const data = await updateLeagueStandings(roomId);
    if (!data) {
      cronJobs[roomId].stop();
      delete cronJobs[roomId];
      return;
    }
    io.to(roomId).emit("currentLeagueStanding", data);
  });
}

function stopAllCronJobs() {
  for (const roomId in cronJobs) {
    cronJobs[roomId].stop();
    delete cronJobs[roomId];
  }
}

module.exports = {
  updateLeagueStandings,
  stopCronJob,
  startCronJob,
  stopAllCronJobs,
};
