//const express = require('express');
const path = require('path');
const fs = require('fs');
//const { receiveMessageOnPort } = require('worker_threads');

const productsFilePath = path.join(__dirname, '..data/productos.json');

//variable que recupera los datos de productos.json 

const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


const productosController =  {

    //listado
    productList: (req, res) => {

        res.render('../views/products/productList.ejs', {products});

    },

    //formulario de creación
    createProducts: (req, res) => res.render('./products/create'), 

    //detalle de un producto
    productDetail: (req, res) => {

        let product = products.filter(p => p.id==req.params.id)

        res.render('../views/products/productDetail.ejs', 
        {
            title: product[0].title,
            number: product[0].number,
            parrafo: product[0].parrafo,
            price: product[0].price,
            image: product[0].image,
        })

    },

    //formulario de edición
    editProducts: (req, res) => {

        let product = products.filter(p => p.id==req.params.id)

        res.render('../views/products/editProducts.ejs', 
        {
            title: product[0].title,
            number: product[0].number,
            parrafo: product[0].parrafo,
            price: product[0].price,

        })
    },

    //acción de creación (post)
    createNewProduct: (req, res) => {
        let newProduct = {
            id: products[products.length-1].id-1,
            ...req.body,
            image:"default-image.png"
    };
    products.push(newProduct)
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, " "));
            res.redirect('./products/createProducts');
        },
    
    //acción de edición (put)
    editNewProduct: (req, res) => {
        let id = req.params.id;
            let productToEdit = products.find((product) => product.id == id);
            productToEdit = {
                id: productToEdit.id,
                ...req.body,
                image: productToEdit.image,
            };

        let newProducts = products.map((product) => {
            if (product.id == productToEdit.id) {
                return product = {...productToEdit}
            } else {
                return product;
            };
        });
    },
         
        

    //acción de borrado (delete)
    deleteProduct: (req, res) => {
        let id = req.params.id;
        let finalProducts = products.filter((product) => product.id != id);
        fs.writeFileSync(
            productsFilePath,
            JSON.stringify(finalProducts, null, " ")
    );
    res.redirect('./products/delete');
    }
    
}

module.exports = productosController