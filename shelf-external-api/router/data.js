const express = require('express')
const dataFunc = require('../router_function/data')
const router = express.Router()

router.post('/data/set', dataFunc.setData)
router.post('/data/get', dataFunc.getData)
router.post('/data/del', dataFunc.delData)
router.post('/data/search', dataFunc.searchData)
router.get('/data/user', dataFunc.getUserList)

module.exports = router