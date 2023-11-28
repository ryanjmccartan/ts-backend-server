import express from 'express';
import {IDatabase} from 'pg-promise';
import * as pgPromise from 'pg-promise';
import dotenv from 'dotenv';

const app = express();
const port = 4000;

const pgp = require('pg-promise')();
const db: IDatabase<{}> = pgp(`postgres://ryanmccartan:${process.env.PASSWORD}@localhost:5432/applicant`);

app.get('/', (req, res) => {
    res.send("Hello world");
});

db.none('CREATE TABLE IF NOT EXISTS person (id SERIAL PRIMARY KEY, first_name TEXT, last_name TEXT, age INT, favorite_color TEXT, favorite_music TEXT)');

db.none('INSERT INTO person(first_name, last_name, age, favorite_color, favorite_music) VALUES($1, $2, $3, $4, $5)', 
['Ryan', 'McCartan', 30, 'black', 'metal']);

app.get('/awesome/applicant', async (req, res) => {
  try {
    const data = await db.one('SELECT * FROM person WHERE id = $1', 1);

    res.send(`Hello there! My name is ${data.first_name} ${data.last_name}! I am ${data.age} years old. 
    My favorite color is ${data.favorite_color} and my favorite music genre is ${data.favorite_music}.`);
  } 
  catch (error) {
    console.error('Error getting applicant data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




