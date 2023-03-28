import express from 'express';
import { Position } from '../tools/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    await Position.find({ workplaceId: req.id }).then(results => {
        if (results.length > 0) {
            res.status(200);
            res.send(results);
        } else {
            res.status(404);
            res.send('<h1>No positions found!</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database!</h1>');
    });
});

router.post('/', async (req, res) => {
    let lastID = 0;
    await Position.findOne({ workplaceId: req.id }).sort({ _id: -1 }).limit(1).then(result => {
        lastID = result.toJSON().id;
    }).catch(err => {
        lastID = 0;
    });

    let overallID = 0;
    await Position.findOne().sort({ _id: -1 }).limit(1).then(result => {
        overallID = result.toJSON()._id;
        console.log(result);
        console.log(overallID);
    }).catch(err => {
        overallID = 0;
    });

    let position = new Position({
        _id: overallID + 1,
        id: lastID + 1,
        workplaceId: req.id,
        positionName: req.body.positionName || "",
        location: req.body.location || "",
        workTimeNorm: req.body.workTimeNorm || "",
        description: req.body.description || "",
        requirements: req.body.requirements || [],
        salary: req.body.salary || 0
    });

    console.log(position);

    await position.save().then(result => {
        res.status(201);
        res.location(`/workplaces/${req.params.id}/positions/${position._id}`);
        res.send(result);
    }).catch(err => {
        res.status(500);
        res.send(`<h1>Failed to insert data into the database!\n${err}</h1>`);
    });
});

router.get('/:id', async (req, res) => {
    await Position.findOne({ workplaceId: req.id, id: req.params.id }).then(result => {
        if (result !== null) {
            res.status(200);
            res.send(result);
        } else {
            res.status(404);
            res.send('<h1>No position found</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database!</h1>');
    });
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

    await Position.findOneAndUpdate({ id: req.params.id, workplaceId: req.id }, position, { new: true }).then(result => {
        if (result !== null) {
            res.status(200);
            res.location(`/workplaces/${req.id}/positions/${req.params.id}`);
            res.send(result);
        } else {
            res.status(404);
            res.send('<h1>No position found to update!</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database for update!</h1>');
    });
});

router.delete('/:id', async (req, res) => {
    await Position.findOneAndRemove({ workplaceId: req.id, id: req.params.id }).then(result => {
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