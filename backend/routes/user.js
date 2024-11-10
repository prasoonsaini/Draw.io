const express = require('express');
const mongoose = require('mongoose');
const { UserModel } = require('../db');


const router = express.Router();

// Middleware to parse JSON request
router.use(express.json());

router.get('/:token', async (req, res) => {
    console.log("get user called", req.params)
    const { token } = req.params
    try {
        const user = await UserModel.findOne(
            { token: token }
        )
        if (user) {
            res.json(user)
        }
        else {
            res.json({ message: "user not found" })
        }
    }
    catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res) => {
    console.log(req.body)
    const newUser = req.body;
    try {
        await UserModel.create(newUser)
        // const savedShape = await newShape.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
})

router.put('/:token', async (req, res) => {
    const { token } = req.params
    const updatedUser = await UserModel.findOneAndUpdate(
        { token: token.toString() },
        req.body
    )
    if (updatedUser)
        res.json(updatedUser)
    else
        res.json({ message: "no user found" })
})

module.exports = router;
