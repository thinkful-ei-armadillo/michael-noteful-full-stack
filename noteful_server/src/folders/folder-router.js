'use strict';

const path = require('path');
const express = require('express');
const xss = require('xss'); 
const FolderService = require('./folder-service');

const folderRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = (folder) => ({
   id: folder.id,
   name: xss(folder.name)
});

folderRouter
   .route('/')
   .get((req, res, next) => {
       FolderService.getAllFolders(knex)
         .then(folders => {
             res.json(folders.map(serializeFolder))
         })
         .catch(next);
   })
   .post(jsonParser,(req, res, next) =>{
      const { name } = req.body;
      const newName = { name };
      if (!newName){
          return res.status(400).json({
              error: { message: 'Missing name in folder body'}
          })
      }
      FolderService.insertFolder(
          req.app.get('db'),
          newName
      )
        .then(folder =>{
            res
             .status(201)
             .location(path.posix.join(req.originalUrl, `/${folder.id}`))
             .json(serializeFolder(folder))
        })
        .catch(next);
   })
   