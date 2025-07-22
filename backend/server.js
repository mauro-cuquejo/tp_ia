const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
    const newTask = { id: Date.now().toString(), ...req.body, status: 'Pending' };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).send('Task not found');
    tasks[index] = { ...tasks[index], ...req.body };
    res.json(tasks[index]);
});

app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== req.params.id);
    res.status(204).send();
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
