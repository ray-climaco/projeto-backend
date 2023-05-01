const express = require("express") //iniciando o express
const router = express.Router() //configuração da primeira parte da rota
const cors = require('cors') //uso do pacote cors para consumir a api no front-end
const conectaBandoDeDados = require('./bancoDeDados') //conectando ao arquivo bancoDeDados
conectaBandoDeDados() //chamando a função que conecta o banco de dados

const Mulher = require('./mulherModel') //conctando ao arquivo mulherModel para manipulação dos dados das mulheres

const app = express() //inciando o app
app.use(express.json()) //requisições
app.use(cors())

const porta = 3333 //criando a porta

//GET
async function mostraMulheres(request, response) {
    try {
        const mulheresVindasDoBancoDeDados = await Mulher.find()

        response.json(mulheresVindasDoBancoDeDados)
    } catch (erro){
        console.log(erro)
    }
}

//POST
async function criaMulher(request, response) {
    const novaMulher = new Mulher({
        nome: request.body.nome,
        imagem: request.body.imagem,
        minibio: request.body.minibio,
        citacao: request.body.citacao,
    })

    try {
        const mulherCriada = await novaMulher.save()
        response.status(201).json(mulherCriada)
    } catch(erro){
        console.log(erro)
    }
}

//PATCH
async function corrigeMulher(request, response){
    try {
        const mulherEncontrada = await Mulher.findById(request.params.id)

        if (request.body.nome) {
            mulherEncontrada.nome = request.body.nome
        }
    
        if (request.body.imagem) {
            mulherEncontrada.imagem = request.body.imagem
        }
    
        if (request.body.minibio) {
            mulherEncontrada.minibio = request.body.minibio
        }

        if (request.body.citacao) {
            mulherEncontrada.citacao = request.body.citacao
        }

        const mulherAtualizadaNoBancoDeDados = await mulherEncontrada.save()

        response.json(mulherAtualizadaNoBancoDeDados)
    } catch(erro){
        console.log(erro)
    }
}

//DELETE
async function deletaMulher(request, response){
    try {
        await Mulher.findByIdAndDelete(request.params.id)
        response.json({mensagem: 'Mulher deletada com sucesso!'})
    } catch(erro) {
        console.log(erro)
    }
}

app.use(router.get('/mulheres', mostraMulheres)) //configuração da rota
app.use(router.post('/mulheres', criaMulher)) //configuração rota POST
app.use(router.patch('/mulheres/:id', corrigeMulher)) //configuração rota PATCH
app.use(router.delete('/mulheres/:id', deletaMulher)) //configuração rota DELETE

//PORTA
function mostraPorta() {
    console.log("Servidor criado e rodando na porta ", porta)
}

app.listen(porta, mostraPorta) //exibição do funcionamento da porta