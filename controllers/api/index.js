const router = require('express').Router();
const userRoutes = require('./userRoutes');
const blogpostRoutes = require('./blogpostRoutes');
const dashboardRoutes = require('./dashboardRoutes')

router.use('/users', userRoutes);
router.use('/blogpost', blogpostRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
