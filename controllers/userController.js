const path = require ('path');
const fs = require('fs');

const bcrypt = require('bcryptjs');

const userFilePath = path.resolve(__dirname, '../data/usuarios.json');

const userController = {

    //USERS LIST
    list: (req, res) => {
    
            let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
            res.render('./users/userList.ejs', {users, longitud: users.length});
    },
    
    //REGISTER FORM
    register: (req, res) =>{
        res.render('./users/register')
    },
    //USER DETAIL
    detail: (req, res) => {

        let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        let user = users.filter(p => p.id == req.params.id);
        //console.log(user);
        res.render('./users/detail.ejs', 
        {
            nombre: user[0].nombre,
            apellido: user[0].apellido,
            email: user[0].email,
            password: user[0].password,
            image: user[0].image,
        })
    },

    //LOGIN FORM
    login: (req, res) => {
        res.render('./users/login')
    },
    
    inscripcion: (req, res) => res.render('./users/inscripcion'),

    //PROCESO DE REGISTRO (POST)
    registerProcess: (req, res) => {
        let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        
        let newUser = {
            id: users[users.length-1].id+1,
            ...req.body,
            password: bcrypt.hashSync(req.body.password.toString(), bcrypt.genSaltSync(5), null),
            image: req.file ? req.file.filename : users.image,
        }
            users.push(newUser);
            fs.writeFileSync(userFilePath, JSON.stringify(users, null, " "));
            res.redirect('/user/detail/'+ newUser.id);
        },
    
    //PROCESO DE LOGIN (POST)

    loginProcess: (req, res) => {
        

        let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        let email = req.body.email
        let password = req.body.password
        
        
        let userToLogin = users.filter(u=>{
            let passwordToVerified = u.password
            let emailToVerified = u.email

            return emailToVerified==email && bcrypt.compareSync(password,passwordToVerified)
        })[0]

        if (userToLogin == undefined ){
            res.render("./users/login")
        }else{
            res.render("./users/detail",
        {
            nombre: userToLogin.nombre,
            apellido: userToLogin.apellido,
            email: userToLogin.email,
            image: userToLogin.image
        })
        }

        
    
    
        console.log(req.body)
    
    },
    
    //EDIT FORM
    editUsers: (req, res) => {
        let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        let user = users.filter(p => p.id==req.params.id)
        res.render('./users/edit.ejs', 
        {
            id: user[0].id,
            nombre: user[0].nombre,
            apellido: user[0].apellido,
            email: user[0].email,
            password: user[0].password,
            image: user[0].image,

        })
    },

    //ACCIÓN DE EDICIÓN (PUT)
    editUser: (req, res) => {
        let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        req.body.id = Number(req.params.id);

        let newUsers = users.map((user) => {
            if (user.id == req.body.id) {
                let temp = req.body;
                temp['number'] = user.number;
                user = temp;
                user.image = req.file ? req.file.filename : user.image;
                return user;
            }
            return user;
        });
        let updatedUser = JSON.stringify(newUsers, null, 2);
        fs.writeFileSync(path.resolve(__dirname, '../data/usuarios.json'), updatedUser);
        res.redirect('/user/');
    },

    //ACCIÓN DE BORRADO (DELETE)
    deleteUser: (req, res) => {
        let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        let userId = req.params.id;
        //trae todos los registros distintos al userId
        let finalUsers = users.filter((product) => product.id != userId);
        let usersToSave = JSON.stringify(finalUsers, null, 2);
        fs.writeFileSync(path.resolve(__dirname, '../data/usuarios.json'), usersToSave);
    res.redirect('/user/');
    },

    //DELETE FORM
    deleteUsers: (req, res) => {
        let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        let user = users.filter(p => p.id==req.params.id)
        //console.log(user);
        res.render('./users/delete.ejs', 
        {
            id: user[0].id,
            nombre: user[0].title,
            apellido: user[0].number,
            email: user[0].email,
            password: user[0].password,
            image: user[0].image,
        })
    }

};

module.exports = userController; 