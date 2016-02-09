import express from 'express';
import httpStatus from 'http-status-codes';

let router = new express.Router();

router.get('/items', (req, res) => {
  var logger = req.app.get('logger');
  var actions = req.app.get('actions');
  actions.items.list({
  }, (err, response) => {
    if(err) {
      logger.error('DB error item', err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
    res.status(httpStatus.OK).json(response);
  });
});

router.post('/items', (req, res) => {
  var logger = req.app.get('logger');
  var actions = req.app.get('actions');
  actions.items.create({
    name: req.body.name
  }, (err, response) => {
    if(err && err.type === 'VALIDATION') {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).end();
    } else if(err) {
      logger.error('DB error item', err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
    res.status(httpStatus.OK).json(response);
  });
});

router.route('/items/:id')
  .get((req, res) => {
    var logger = req.app.get('logger');
    var models = req.app.get('models');

    models.item.findOne({
      where: {
        id: req.params.id
      }
    }).then((item) => {
      if (item === null) {
        res.status(httpStatus.NOT_FOUND).end();
        return;
      }
      res.status(httpStatus.OK).json(item);
    }).catch((err) => {
      logger.error('DB error items', err);
      return res.status(httpStatus.NOT_FOUND).end();
    });
  })
  .put((req, res) => {
    var logger = req.app.get('logger');
    var models = req.app.get('models');

    models.item.findOne({
      where: {
        id: req.params.id
      }
    }).then((item) => {
      if (item === null) {
        res.status(httpStatus.NOT_FOUND).end();
        return;
      }
      item.name = req.body.name;
      return item.save();
    }).then((item) => {
      res.status(httpStatus.OK).json(item);
    }).catch((err) => {
      logger.error('DB error items', err);
      return res.status(httpStatus.NOT_FOUND).end();
    });
  })
  .delete((req, res) => {
    var logger = req.app.get('logger');
    var models = req.app.get('models');

    models.item.findOne({
      where: {
        id: req.params.id
      }
    }).then((item) => {
      if (item === null) {
        res.status(httpStatus.NOT_FOUND).end();
        return;
      }
      return item.destroy();
    }).then(() => {
      res.status(httpStatus.OK).json(item);
    }).catch((err) => {
      logger.error('DB error items', err);
      return res.status(httpStatus.NOT_FOUND).end();
    });
  });

export default router;
