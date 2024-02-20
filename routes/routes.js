const express = require('express');
const router = express.Router();
const User = require('../models/models');
const multer = require('multer');
const swal = require('sweetalert');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + "-" + file.originalname)
    }
})

let upload = multer({ storage: storage }).single('image');

//inserting image
router.post('/add', upload, (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename
        });
        user.save();
        req.session.message = {
            type: 'success',
            message: 'User Successfully Added!'
        }
    } catch (err) {
        req.session.message = ({ message: err.message, type: 'danger' });
    }

    res.redirect('/');

})

//get all users
router.get('/', async (req, res) => {
    // Logic to fetch all users from the database
    try {
        const user = await User.find({}).exec();
        res.render('index', {
            title: 'HomePage',
            users: user
        })
    } catch (err) {
        res.render({
            message: err.message
        })
    }

});

router.get('/', (req, res) => {
    res.render('index', { title: 'Home page' });
})

router.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add Users' });
});
//edit user by id
router.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id).exec();
        res.render('edit_users', {
            title: 'Edit User',
            users: user
        })
    } catch (err) {
        res.render({
            message: err.message
        })
        res.redirect('/');
    }
})

//update user
router.post('/edit/:id', upload, async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id).exec();
        user.name = req.body.name;
        user.email = req.body.email;
        user.phone = req.body.phone;
        if (req.file){
        user.image = req.file.filename
        }
        await user.save();
        req.session.message = {
            type: 'primary',
            message: 'User Edited Successfully!'
        }
        res.redirect('/');
    } catch (err) {
        req.session.message = ({ message: err.message, type: 'danger' });
    }
})


//delete user by id
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    try {
        User.findByIdAndDelete(id).exec();
       
        res.render('index', {
            title: 'HomePage',
            message: 'User Deleted Successfully!'
        });
        req.session.message = {
            type: 'danger',
            message: 'User Deleted Successfully!'
        }
        res.redirect('/');

    } catch (err) {
        res.render({
            message: err.message
        })
    }
})

module.exports = router;