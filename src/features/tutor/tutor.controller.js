const catchAsync = require('../../utils/catch-async');
const { ok } = require('../../utils/respond');
const lessons = require('./tutor-lessons.service');
const sessions = require('./tutor-sessions.service');
const settings = require('./tutor-settings.service');
const { getProgress } = require('./tutor-progress.service');

const deviceOf = (req) => req.device.id;

module.exports = {
  lessons: catchAsync(async (req, res) => ok(res, await lessons.listLessons(deviceOf(req), req.valid.query.languageCode))),
  create: catchAsync(async (req, res) => ok(res, await sessions.createSession(deviceOf(req), req.valid.body))),
  turn: catchAsync(async (req, res) => ok(res, await sessions.takeTurn(deviceOf(req), req.valid.params.id, req.valid.body))),
  complete: catchAsync(async (req, res) =>
    ok(res, await sessions.completeSession(deviceOf(req), req.valid.params.id, req.valid.body))),
  progress: catchAsync(async (req, res) => ok(res, await getProgress(deviceOf(req), req.valid.query.languageCode))),
  getSettings: catchAsync(async (req, res) => ok(res, await settings.getSettings(deviceOf(req)))),
  saveSettings: catchAsync(async (req, res) => ok(res, await settings.saveSettings(deviceOf(req), req.valid.body))),
};
