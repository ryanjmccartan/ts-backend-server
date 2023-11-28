import {db, app} from '../src/index';
import request from 'supertest';

describe('Tests for applicant API endpoints', () => {
  beforeAll(async () => {
    await db.none('CREATE TABLE IF NOT EXISTS person (id SERIAL PRIMARY KEY, first_name TEXT, last_name TEXT, age INT, favorite_color TEXT, favorite_music TEXT)');
  });

  afterAll(async () => {
    await db.none('DROP TABLE IF EXISTS person');
    db.$pool.end();
  }); 

  test('POST /person should create new person', async () => {
    const response = await request(app)
        .post('/person')
        .send({
            first_name: "Ryan",
            last_name: "McCartan",
            age: 30,
            favorite_color: "Black",
            favorite_music: "Metal",
        });
    expect(response.status).toBe(200);
  });

  test('GET /awesome/applicant should return my info', async () => {
    const response = await request(app).get('/awesome/applicant');
    console.log(response.text);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello there! My name is Ryan McCartan!');
  });

  test('UPDATE /person/:id should update person with id param', async () => {
    const response = await request(app)
      .put('/person/1')
      .send({
        first_name: "UpdateRyan",
        last_name: "UpdateMcCartan",
        age: 31,
        favorite_color: "Blue",
        favorite_music: "Pop Punk"
    });
    console.log("Updated: ", response.body);
    expect(response.status).toBe(200);
  });

  test('DELETE /person/:id should delete person with id param', async () => {
    const response = await request(app).delete('/person/1');
    expect(response.status).toBe(200);
  });

});




   