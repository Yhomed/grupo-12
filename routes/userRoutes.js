const express = require('express');

const router = express.Router();

const multer = require('multer');

const path = require('path');

const db = require('../database/models/');

const Usuario = db.Usuario;

const {
  check,
  validationResult,
  body
} = require('express-validator');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img/users')
    },
    filename: function (req, file, cb) {
      cb(null,'user' + Date.now() + path.extname(file.originalname)) 
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
      const extension = path.extname(file.originalname).toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        return res.status(400).send('Por favor sube una imagen en formato JPG, JPEG, PNG o GIF.');
      } 
    }
  })
  
  const uploadFile = multer({ storage })

const userController = require('../controllers/userController');

const userIsLogged = require('../middlewares/userIsLogged');

// 11 RUTAS

router.get('/', userIsLogged, userController.list); // listado

router.get('/list',userController.list); // json api 
router.get('/:id/show',userController.list); // json api 

router.get('/detail/:id', userIsLogged, userController.detail); //detalle

router.get('/register', userIsLogged, userController.register); // Registro

router.get('/login',userIsLogged, userController.login); // Login

router.post('/logout',  userController.logOut) // Accion Logout

router.get('/inscripcion', userIsLogged, userController.inscripcion); // Inscripción

Usuario.findAll()
    .then((users) => {
router.post('/', uploadFile.single("image"),[
  
  check('name').isLength({
        min: 2
      }).withMessage('El campo nombre no puede estar vacío'),
  check('surname').isLength({min: 2   
      }).withMessage('El campo apellido no puede estar vacío'),
  check('email').isEmail().withMessage('Agregar un email válido'),

    
  check('password').isLength({min: 8 }).withMessage('La contraseña debe tener un mínimo de 8 caractéres al menos una letra y un número'),

  body('email').custom(function (value) {
    let cont = 0;
    for (let i = 0; i < users.length; i++) {
        if (users[i].email == value) {
            cont++;
        }
    }
    if (cont > 0) {
        return false;   
    } else {
        return true;    
    }
  }).withMessage('Usuario ya se encuentra registrado'),

body('image').custom(function (value, { req }) {
  let extension
  if(req.file != undefined ){
      return true
  }else{
      extension = ""+path.extname(req.files[0].filename).toLowerCase();
  }
  if (
      extension == ".jpg" ||
      extension == ".jpeg" ||
      extension == ".png" ||
      extension == ".gif"){
          return true;
      }
      return false;
}).withMessage('Solo debe seleccionar archivos  con extensión JPG, JPEG, PNG o GIF')
], userController.registerProcess);//registerProcess
    })
.catch((errors) => {
  console.log(errors);
})  


router.post('/profile',[
  check('email').isEmail().withMessage('Email invalido'),
  check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
] ,userController.loginProcess); //loginProcess

router.get('/profile/:id', userController.profile) //vista del perfil de usuario

router.get('/:id/edit', userController.editUsers); //editUsers (form)

router.put('/:id', uploadFile.single('image'), userController.editUser); //editUser

router.delete('/:id', userController.deleteUser); //deleteUser

router.get('/:id/delete', userController.deleteUsers); //deleteUsers (form)

module.exports= router;
