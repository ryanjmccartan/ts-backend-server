import express from 'express';
import {IDatabase} from 'pg-promise';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();
export const app = express();
const port = 4000;

app.use(bodyParser.json());

const pgp = require('pg-promise')();
export const db: IDatabase<{}> = pgp(`postgres://${process.env.USER}:${process.env.PASSWORD}@localhost:5432/applicant`);

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.post('/person', async (req, res) => {
  const {first_name, last_name, age, favorite_color, favorite_music} = req.body;

  try {
      const response = await db.one('INSERT INTO person(first_name, last_name, age, favorite_color, favorite_music) VALUES($1, $2, $3, $4, $5) RETURNING id', 
      [first_name, last_name, age, favorite_color, favorite_music]);

      res.json({id: response.id, first_name, last_name, age, favorite_color, favorite_music});
  } catch(error) {
      console.error('Error creating data: ', error);
      res.status(500).json({ error: '500 Internal Server Error' });
  }
});

app.get('/awesome/applicant', async (req, res) => {
  try {
    const data = await db.one('SELECT * FROM person');

    res.send(`Hello there! My name is ${data.first_name} ${data.last_name}! I am ${data.age} years old. 
    My favorite color is ${data.favorite_color} and my favorite music genre is ${data.favorite_music}.`);
  } 
  catch (error) {
    console.error('Error getting applicant data: ', error);
  }
});

  app.put('/person/:id', async (req, res) => {
    const {id} = req.params;
    const {first_name, last_name, age, favorite_color, favorite_music} = req.body;

    try {
        await db.none('UPDATE person SET first_name = $1, last_name = $2, age = $3, favorite_color = $4, favorite_music = $5 WHERE id = $6', 
        [first_name, last_name, age, favorite_color, favorite_music, id]);
        res.json({id, first_name, last_name, age, favorite_color, favorite_music});
    } catch(error) {
        console.error('Error updating person: ', error);
        res.status(404).json({ error: 'Person could not be found' });
    }
  })

  app.delete('/person/:id', async (req, res) => {
    const {id} = req.params;

    try {
        await db.none('DELETE FROM person WHERE id = $1', id);
        res.json({ message: 'Successfully deleted person'});
    } catch(error) {
        console.error('Error deleting person: ', error)
        res.status(404).json({ error: 'Person could not be found' });
    }
  })

/* app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); */


