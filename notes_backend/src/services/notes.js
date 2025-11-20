const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

/**
 * Simple file-backed in-memory notes store.
 * - Stores notes at data/notes.json (created if missing)
 * - Keeps an in-memory cache and writes after each mutation
 * - Provides CRUD operations and simple validation
 */

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'notes.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const seed = [
      {
        id: randomUUID(),
        title: 'Welcome to Notes',
        content: 'This is your first note. Feel free to edit or delete it.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        title: 'Second Note',
        content: 'Add as many notes as you like. The API supports full CRUD.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
  }
}

function loadAll() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data;
  } catch (e) {
    // If corrupted, reset to empty array
    return [];
  }
}

function saveAll(notes) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

class NotesService {
  constructor() {
    this._cache = loadAll();
  }

  // PUBLIC_INTERFACE
  list() {
    /** Return all notes */
    return [...this._cache];
  }

  // PUBLIC_INTERFACE
  getById(id) {
    /** Return a single note by id or null if not found */
    return this._cache.find((n) => n.id === id) || null;
  }

  // PUBLIC_INTERFACE
  create({ title, content }) {
    /** Create a new note with validation */
    const errors = [];
    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push('title is required and must be a non-empty string');
    }
    if (content !== undefined && typeof content !== 'string') {
      errors.push('content must be a string');
    }
    if (errors.length) {
      const err = new Error('Validation failed');
      err.status = 400;
      err.details = errors;
      throw err;
    }
    const now = new Date().toISOString();
    const note = {
      id: randomUUID(),
      title: title.trim(),
      content: (content || '').toString(),
      createdAt: now,
      updatedAt: now,
    };
    this._cache.unshift(note);
    saveAll(this._cache);
    return note;
  }

  // PUBLIC_INTERFACE
  update(id, { title, content }) {
    /** Update a note by id; partial updates allowed but must be valid types */
    const idx = this._cache.findIndex((n) => n.id === id);
    if (idx === -1) {
      const err = new Error('Note not found');
      err.status = 404;
      throw err;
    }

    const errors = [];
    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      errors.push('title must be a non-empty string when provided');
    }
    if (content !== undefined && typeof content !== 'string') {
      errors.push('content must be a string when provided');
    }
    if (errors.length) {
      const err = new Error('Validation failed');
      err.status = 400;
      err.details = errors;
      throw err;
    }

    const existing = this._cache[idx];
    const updated = {
      ...existing,
      title: title !== undefined ? title.trim() : existing.title,
      content: content !== undefined ? content : existing.content,
      updatedAt: new Date().toISOString(),
    };
    this._cache[idx] = updated;
    saveAll(this._cache);
    return updated;
  }

  // PUBLIC_INTERFACE
  remove(id) {
    /** Delete a note by id */
    const idx = this._cache.findIndex((n) => n.id === id);
    if (idx === -1) {
      const err = new Error('Note not found');
      err.status = 404;
      throw err;
    }
    const [deleted] = this._cache.splice(idx, 1);
    saveAll(this._cache);
    return deleted;
  }
}

module.exports = new NotesService();
