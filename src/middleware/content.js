export default (type) => {
  return (req, res, next) => {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(type)) {
      return res.status(400).send({ success: false, message: 'Wrong type' })
    }
    next()
  }
}