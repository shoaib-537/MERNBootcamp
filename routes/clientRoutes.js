const express = require('express');
const router = express.Router();

const {
  clientController
} = require('../controllers');

/* GET clients listing. */
router.get('/', async function(req, res, next) {
  const query = req.query;
  try {
    const result = await clientController.getAllClients(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async function(req, res, next) {
  const body = req.body;
  try {
    const result = await clientController.addClient(body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

 router.put('/:id', async function(req, res, next){
  const body = req.body;
  if (!req.params.id) {
    return res.status(400).send({ message: "_id is required"});
  }
  try {
    const result = await clientController.updateClient(body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
 });

 router.delete('/:id', async function(req, res, next){
  const id = req.params.id;
  try {
    const filter = { _id: id };
    const result = await clientController.deleteClient(filter);
    res.status(200).send({ message: 'Deleted Successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
 });

module.exports = router;
