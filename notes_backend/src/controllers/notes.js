const notesService = require('../services/notes');

class NotesController {
  // PUBLIC_INTERFACE
  list(req, res, next) {
    /** List all notes */
    try {
      const notes = notesService.list();
      return res.status(200).json({ data: notes });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  get(req, res, next) {
    /** Get a note by id */
    try {
      const { id } = req.params;
      const note = notesService.getById(id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      return res.status(200).json({ data: note });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  create(req, res, next) {
    /** Create a new note */
    try {
      const { title, content } = req.body || {};
      const note = notesService.create({ title, content });
      return res.status(201).json({ data: note });
    } catch (err) {
      if (err.status === 400) {
        return res.status(400).json({ error: err.message, details: err.details || [] });
      }
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  update(req, res, next) {
    /** Update note by id */
    try {
      const { id } = req.params;
      const { title, content } = req.body || {};
      const note = notesService.update(id, { title, content });
      return res.status(200).json({ data: note });
    } catch (err) {
      if (err.status === 400) {
        return res.status(400).json({ error: err.message, details: err.details || [] });
      }
      if (err.status === 404) {
        return res.status(404).json({ error: 'Note not found' });
      }
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  remove(req, res, next) {
    /** Delete note by id */
    try {
      const { id } = req.params;
      const deleted = notesService.remove(id);
      return res.status(200).json({ data: deleted });
    } catch (err) {
      if (err.status === 404) {
        return res.status(404).json({ error: 'Note not found' });
      }
      return next(err);
    }
  }
}

module.exports = new NotesController();
