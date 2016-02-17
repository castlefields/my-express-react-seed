import express from 'express';
import httpStatus from 'http-status-codes';
import validator from 'validator';

let router = new express.Router();

router.get('/items', (req, res) => {
  var logger = req.app.get('logger');
  var actions = req.app.get('actions');
  actions.items.list({
  }, (err, items) => {
    if(err) {
      logger.error('DB error item', err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
    res.status(httpStatus.OK).json(items);
  });
});

router.post('/items', (req, res) => {
  var logger = req.app.get('logger');
  var actions = req.app.get('actions');
  var name = req.body.name;

  if(name && validator.isLength(name, {min:0, max:60})) {
    actions.items.create({
      name
    }, (err, item) => {
      if (err) {
        logger.error('DB error item', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }
      res.status(httpStatus.OK).json(item);
    });
  } else {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).end();
  }
});

router.route('/items/:id')
  .get((req, res) => {
    var logger = req.app.get('logger');
    var actions = req.app.get('actions');
    actions.items.list({
      id: req.params.id
    }, (err, items) => {
      if(err) {
        logger.error('DB error item', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }
      if(!items || items.length === 0) {
        return res.status(httpStatus.NOT_FOUND).end();
      }
      res.status(httpStatus.OK).json(items[0]);
    });
  })
  .put((req, res) => {
    var logger = req.app.get('logger');
    var actions = req.app.get('actions');
    var name = req.body.name;

    if(name && validator.isLength(name, {min:0, max:60})) {
      actions.items.list({
        id: req.params.id
      }, (err, items) => {
        if (err) {
          logger.error('DB error item', err);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
        }
        if (!items || items.length === 0) {
          return res.status(httpStatus.NOT_FOUND).end();
        }
        actions.items.update(items[0], {
          name
        }, (err, item) => {
          if (err) {
            logger.error('DB error item', err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
          }
          res.status(httpStatus.OK).json(item);
        });
      });
    } else {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).end();
    }
  })
  .delete((req, res) => {
    var logger = req.app.get('logger');
    var actions = req.app.get('actions');
    actions.items.list({
      id: req.params.id
    }, (err, items) => {
      if(err) {
        logger.error('DB error item', err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }
      if(!items || items.length === 0) {
        return res.status(httpStatus.NOT_FOUND).end();
      }
      actions.items.delete(items[0], (err) => {
        if(err) {
          logger.error('DB error item', err);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
        }
        res.status(httpStatus.OK).end();
      });
    });
  });

export default router;
