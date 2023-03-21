import express from 'express';
import { Workplace } from '../tools/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    await Workplace.find().then(results => {
        if (results.length > 0) {
            res.status(200);
            res.send(results);
        } else {
            res.status(404);
            res.send('<h1>No workplaces found!</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database!</h1>');
    });
});

router.post('/', async (req, res) => {
    let lastID = 0;
    await Workplace.findOne().sort({ _id: -1 }).limit(1).then(result => {
        lastID = result.toJSON()._id;
    }).catch(err => {
        lastID = 0;
    });

    let workplace = new Workplace({
        _id: lastID + 1,
        companyName: req.body.companyName,
        description: req.body.description,
        industry: req.body.industry,
        website: req.body.website,
        specialities: req.body.specialities
    });

    await workplace.save().then(result => {
        res.status(201);
        res.location(`http://localhost:80/workplaces/${workplace._id}`);
        res.send(result);
    }).catch(err => {
        res.status(500);
        res.send(`<h1>Failed to insert data into the database!\n${err}</h1>`);
    });
});

router.get('/:id', async (req, res) => {
    await Workplace.findOne({ _id: req.params.id }).then(result => {
        if (result !== null) {
            res.status(200);
            res.send(result);
        } else {
            res.status(404);
            res.send('<h1>No workplace found</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database!</h1>');
    });
});

router.put('/:id', async (req, res) => {
    let workplace = new Workplace({
        _id: req.params.id,
        companyName: req.body.companyName,
        description: req.body.description,
        industry: req.body.industry,
        website: req.body.website,
        specialities: req.body.specialities
    });

    await Workplace.findOneAndUpdate({ _id: req.params.id }, workplace, { new: true }).then(result => {
        if (result !== null) {
            res.status(200);
            res.location(`http://localhost:80/workplaces/${req.params.id}`);
            res.send(result);
        } else {
            res.status(404);
            res.send('<h1>No workplace found to update!</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database for update!</h1>');
    });
});

router.delete('/:id', async (req, res) => {
    await Workplace.findOneAndRemove({ _id: req.params.id }).then(result => {
        if (result) {
            res.status(204);
            res.send('');
        } else {
            res.status(404);
            res.send('<h1>No workplace found for deletion!</h1>');
        }
    }).catch(err => {
        res.status(500);
        res.send('<h1>Failed to collect data from the database for deletion!</h1>');
    });
});

export default router;