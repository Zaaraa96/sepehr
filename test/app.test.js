const request = require('supertest');
const app = require('../apps/client_app/client_app');
const db = require('../service/db_service');

describe('API Endpoints', () => {
    beforeEach(async () => {
        await db.dropDatabase();
    });
    it('GET /api/v1/user should return list of users', async () => {
        const res = await request(app).get('/api/v1/user');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data', {"docs": [], "hasNextPage": false, "hasPrevPage": false, "limit": 10, "nextPage": null, "page": 1, "pagingCounter": 1, "prevPage": null, "totalDocs": 0, "totalPages": 1});
    });

    it('POST /api/v1/user should return created user', async () => {
        const res = await request(app)
            .post('/api/v1/user')
            .send({
                "phoneNumber": "09387180565",
                "fullName": "Zahra Ahmadi",
                "password": "123"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'ok');
    });

    it('POST /api/v1/user should return created user', async () => {
        const res = await request(app)
            .post('/api/v1/user')
            .send({
                "phoneNumber": "0938718056",
                "fullName": "Zahra Ahmadi",
                "password": "123"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('status', 'err');
    });
});
