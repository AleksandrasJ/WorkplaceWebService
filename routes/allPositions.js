import express from 'express';
import { Position } from '../tools/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    await Position.find().then(results => {
        if (results.length > 0) {
            res.status(200);
            res.send(results);
        } else {
            res.status(404);
            res.send('<h1>No positions found!</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database</h1>');
    });
});

router.get('/:id', async (req, res) => {
    await Position.findOne({ _id: req.params.id }).then(result => {
        if (result !== null) {
            res.status(200);
            res.send(result);
        } else {
            res.status(404);
            res.send('<h1>No position found!</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database!</h1>');
    })
});

router.put('/:id', async (req, res) => {
    let position = {
        positionName: req.body.positionName,
        location: req.body.location,
        workTimeNorm: req.body.workTimeNorm,
        description: req.body.description,
        requirements: req.body.requirements,
        salary: req.body.salary
    };

    await Position.findByIdAndUpdate({ _id: req.params.id }, position, { new: true }).then(result => {
        if (result !== null) {
            res.status(200);
            res.location(`/workplaces/${result.workplaceId}/positions/${result.id}`);
            res.send(result);
        } else {
            res.status(404);
            res.send('<h1>No position found to update!</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collecto data from the data base!</h1>');
    })
});

router.delete('/:id', async (req, res) => {
    await Position.findOneAndRemove({ _id: req.params.id }).then(result => {
        if (result) {
            res.status(204);
            res.send('');
        } else {
            res.status(404);
            res.send('<h1>No position found for deletion!</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database for deletion!</h1>');
    });
});

export default router;