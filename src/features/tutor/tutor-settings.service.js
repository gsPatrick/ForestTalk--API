const { TutorSetting } = require('../../models');
const { DEFAULT_GOAL } = require('./tutor.constants');

async function getGoal(deviceId) {
  const row = await TutorSetting.findByPk(deviceId);
  return row?.dailyGoalMinutes ?? DEFAULT_GOAL;
}

async function saveSettings(deviceId, { dailyGoalMinutes }) {
  await TutorSetting.upsert({ deviceId, dailyGoalMinutes });
  return { dailyGoalMinutes };
}

module.exports = { getGoal, saveSettings, getSettings: async (deviceId) => ({ dailyGoalMinutes: await getGoal(deviceId) }) };
