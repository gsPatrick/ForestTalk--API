const { Collection, CollectionCard } = require('../../models');
const AppError = require('../../utils/app-error');
const { ANIMALS, STARTER_ID } = require('./collection.constants');

async function getCollection(deviceId) {
  const [cards, row] = await Promise.all([
    CollectionCard.findAll({ where: { deviceId }, order: [['position', 'ASC']] }),
    Collection.findByPk(deviceId),
  ]);
  return { unlockedIds: cards.map((c) => c.animalId), equippedId: row?.equippedAnimalId ?? null };
}

/** Equipa um animal desbloqueado; `null` (ou o leão) volta ao mascote inicial. */
async function equip(deviceId, animalId) {
  const target = animalId === STARTER_ID ? null : animalId;
  if (target !== null) {
    if (!ANIMALS.some((a) => a.id === target)) throw AppError.notFound('Animal desconhecido', 'UNKNOWN_ANIMAL');
    const owned = await CollectionCard.count({ where: { deviceId, animalId: target } });
    if (!owned) throw AppError.conflict('Animal ainda não desbloqueado', 'ANIMAL_LOCKED');
  }
  await Collection.upsert({ deviceId, equippedAnimalId: target });
  return getCollection(deviceId);
}

module.exports = { getCollection, equip };
