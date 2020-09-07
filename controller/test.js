exports.select = (req, res, next) => {
  const db = req.app.locals.db.pg
  db.query('SELECT * FROM public.test WHERE St_id = $1', [req.params.id], (error, response) => {
    if (error) {
      return next(error)
    }
    res.send(response.rows)
  })
}