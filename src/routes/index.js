const { Router } = require('express');
const healthRoutes = require('../features/health/health.routes');
const devicesRoutes = require('../features/devices/devices.routes');
const languagesRoutes = require('../features/languages/languages.routes');
const progressRoutes = require('../features/progress/progress.routes');
const walletRoutes = require('../features/wallet/wallet.routes');
const shopRoutes = require('../features/shop/shop.routes');
const powerUpsRoutes = require('../features/power-ups/power-ups.routes');
const collectionRoutes = require('../features/collection/collection.routes');
const gameContentRoutes = require('../features/game-content/game-content.routes');
const simulationsRoutes = require('../features/simulations/simulations.routes');
const chatRoutes = require('../features/chat/chat.routes');
const speechRoutes = require('../features/speech/speech.routes');
const subscriptionRoutes = require('../features/subscription/subscription.routes');

const router = Router();

// Sondas (sem versão): orquestração e load balancers.
router.use('/health', healthRoutes);
router.use('/v1/ping', healthRoutes);

// v1 — cada feature monta o seu próprio prefixo de caminho.
router.use('/v1/devices', devicesRoutes);
router.use('/v1/languages', languagesRoutes); // idiomas + trilha + progresso + conteúdo dos jogos (por idioma)
router.use('/v1/languages', progressRoutes);
router.use('/v1/languages', gameContentRoutes);
router.use('/v1/wallet', walletRoutes);
router.use('/v1/shop', shopRoutes);
router.use('/v1/power-ups', powerUpsRoutes);
router.use('/v1/collection', collectionRoutes);
router.use('/v1/sim', simulationsRoutes);
router.use('/v1/chat', chatRoutes);
router.use('/v1/speech', speechRoutes);
router.use('/v1/subscription', subscriptionRoutes);

module.exports = router;
