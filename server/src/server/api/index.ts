import Router from 'express';

const router = Router();

router.use('/teste', (req, res) => {
    res.send(404);
});

export default router;