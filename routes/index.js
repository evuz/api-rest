'use strict'

const express = require('express');
const FieldCtrl = require('../controllers/field')
const api = express.Router();

api.get('/field', FieldCtrl.getFields);
api.get('/field/:fieldId', FieldCtrl.getField);
api.post('/field', FieldCtrl.saveField);
api.put('/field/:fieldId', FieldCtrl.updateField);
api.delete('/field/:fieldId', FieldCtrl.deleteField);

module.exports = api;