# Notes Backend (Express)

Simple Express-based REST API for managing notes with file-backed persistence and in-memory cache.

- Port: 3001
- Docs: GET http://localhost:3001/docs
- Health: GET http://localhost:3001/

## Endpoints

- GET /api/notes
- GET /api/notes/{id}
- POST /api/notes
- PUT /api/notes/{id}
- DELETE /api/notes/{id}

Note object:
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}

### Example requests

List notes:
curl -s http://localhost:3001/api/notes | jq .

Create:
curl -s -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Hello"}' | jq .

Get by id:
curl -s http://localhost:3001/api/notes/<id> | jq .

Update:
curl -s -X PUT http://localhost:3001/api/notes/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","content":"New text"}' | jq .

Delete:
curl -s -X DELETE http://localhost:3001/api/notes/<id> | jq .

## Development

Install dependencies and start:
npm install
npm run dev

Production:
npm start

Data is stored in notes_backend/data/notes.json (auto-created with seed data).
