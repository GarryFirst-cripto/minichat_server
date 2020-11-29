const passwordUserValid = (req, res, next) => {
  try {
    if (req.body) {
      const { pass } = req.body;
      if ((pass) && (pass.length < 5)) {
        res.data = { error: true, text: 'Your password to short !', status: 403 };
      } else {
        res.data = { error: false, text: '', status: 200 };
      }
    } else {
      res.data = { error: true, text: 'No data in request !', status: 404 };
    }
    next();
  } catch (error) {
    res.data = { error: true, text: error, status: 404 };
    next();
  }
};

export default passwordUserValid;
