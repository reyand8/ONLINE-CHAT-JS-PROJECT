const express = require('express')
const router = require('express').Router()

router.get('/', (request, response) => {
    response.send('Hello world!')
})

module.exports = router