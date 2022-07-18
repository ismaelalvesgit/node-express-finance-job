# Ambiente de EXEMPLO para express.js
[![Build Status](https://app.travis-ci.com/ismaelalvesgit/node-express-example.svg?branch=master)](https://app.travis-ci.com/ismaelalvesgit/node-express-example)

Este projeto foi criado para motivos acadêmicos para minha aprendizagem pessoal
utilizando [Node.js](https://nodejs.org/en/) e [Express](https://expressjs.com/pt-br/).

## Development

### Setup

#### 1) Instalação de dependencias
``` sh
npm i 
```
Obs: E necessario que o [NodeJs](https://nodejs.org/en/) já esteja instalado em sua máquina

#### 2) Iniciar Projeto
``` sh
npm start

# verificar logs
```
ou

``` sh
npm run dev

# executar job especifico
```

## EXTRA
#### 1) Base de dados
Antes de iniciar qual ambiente sejá ele `LOCAL | DOCKERIZADO` deve ser criado uma base de dados no [mysql](https://www.mysql.com/) uma para o 
ambiente de DEV. Para mais informações veirifique `./src/env.js` para as variaveis de ambiente verifirifique `.env.example`

Database Name | User Database | Password Database
--------------|---------------|------------------
finance       |    `root`     | admin

#### 2) Email Config
Estarei deixando o link do [appMenosSeguro](https://myaccount.google.com/u/2/lesssecureapps) que necessita estar 
habilitado para utilização do serviço de envio de email padrão. Para utilizar os serviços de email com OAuth2 siga 
os proximos passo [link](https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a).

## Contato
Desenvolvido por: [Ismael Alves](https://github.com/ismaelalvesgit) 🤓🤓🤓

* Email: [cearaismael1997@gmail.com](mailto:cearaismael1997@gmail.com) 
* Github: [github.com/ismaelalvesgit](https://github.com/ismaelalvesgit)
* Linkedin: [linkedin.com/in/ismael-alves-6945531a0/](https://www.linkedin.com/in/ismael-alves-6945531a0/)

### Customização de Configurações do projeto
Verifique [Configurações e Referencias](https://www.npmjs.com/package/cron).
