const express = require('express');

//Controladores
const Controllers_Estudantes = require('./Controllers/ctrl_Estudantes');
const Controllers_Empresas = require('./Controllers/ctrl_Empresas');
const Controllers_Groups = require('./Controllers/ctrl_Groups');
const Controllers_Projetos =  require('./Controllers/ctrl_Projetos');
const Controllers_Propostas = require('./Controllers/ctrl_Propostas');
const Controllers_Aplicações = require('./Controllers/ctrl_Aplicações');
const Controllers_Aceita_Aplicação = require('./Controllers/ctrl_Aceita_Aplicação');
const Controllers_Aceita_Proposta = require('./Controllers/ctrl_Aceita_Proposta');
const Controllers_Sessions = require('./Controllers/ctrl_Sessions');

const routes  = express.Router();

//Rotas Estudantes
routes.post('/users', Controllers_Estudantes.Create);
routes.get('/users',Controllers_Estudantes.List);

//Rotas Empresa
routes.post('/business', Controllers_Empresas.Create);
routes.get('/business', Controllers_Empresas.List);

//Rotas Grupo
routes.post('/groups', Controllers_Groups.Create);
routes.get('/groups', Controllers_Groups.List);
routes.delete('/groups/:id', Controllers_Groups.Delete);
routes.put('/groups/:id', Controllers_Groups.Update);

//Rotas Projetos
routes.post('/project', Controllers_Projetos.Create);
routes.get('/project', Controllers_Projetos.List);
routes.delete('/project/:id', Controllers_Projetos.Delete);
routes.put('/project/:id', Controllers_Projetos.Update);

//Rotas Propostas
routes.post('/prop/:id', Controllers_Propostas.Create);
routes.get('/prop/:id', Controllers_Propostas.List);
routes.delete('/prop/:id', Controllers_Propostas.Delete);

//Rotas Aplicações
routes.post('/aplication/:id', Controllers_Aplicações.Crate);
routes.get('/aplication/:id', Controllers_Aplicações.List);
routes.delete('/aplication/:id', Controllers_Aplicações.Delete);

//Rotas Aceitação
routes.post('/App_accept/:id', Controllers_Aceita_Aplicação.Update);
routes.post('/Prop_accept/:id', Controllers_Aceita_Proposta.Update);

//Log in
routes.post('/session', Controllers_Sessions.Create);

module.exports = routes;