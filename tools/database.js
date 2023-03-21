import mongoose from "mongoose";

const { Schema } = mongoose;

mongoose.connect('mongodb://mongo:27017/jobs', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database succesfully!'))
    .catch((err) => {
        console.log('Failed to connect to database!');
        console.log(err);
    })


const workplaceSchema = new Schema({
    _id: Number,
    companyName: String,
    description: String,
    industry: String,
    website: String,
    specialities: [String]
});

const positionSchema = new Schema({
    id: Number,
    workplaceId: Number,
    positionName: String,
    location: String,
    workTimeNorm: String,
    description: String,
    requirements: [String],
    salary: Number
});

const Workplace = mongoose.model('Workplace', workplaceSchema);
const Position = mongoose.model('Position', positionSchema);

export { Workplace, Position };