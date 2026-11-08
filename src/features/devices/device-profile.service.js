const AppError = require('../../utils/app-error');
const { Device } = require('../../models');

async function getDevice(deviceId) {
  const device = await Device.findByPk(deviceId);
  if (!device) throw AppError.notFound('Aparelho não encontrado', 'DEVICE_NOT_FOUND');
  return { deviceId: device.id, platform: device.platform, appVersion: device.appVersion, locale: device.locale };
}

module.exports = { getDevice };
