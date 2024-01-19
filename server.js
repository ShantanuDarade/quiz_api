require("dotenv").config()

const express = require("express")
const Question = require('./models/question')
const APIKEY = require('./models/apikey')
const uuid = require('uuid')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT 

app.set('view engine', 'ejs')

app.use(
    cors({
        origin: "*",
    })
)

app.use(express.urlencoded({extended:true}))

app.get('/', async (req,res) => {
    res.render('index')
})

app.post('/apikey', async (req,res) => {
    const id = uuid.v4()
    try {
        await APIKEY.create({ _id:id })
        res.render('apikey',{id})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/add',async (req,res) => {
    const {question,option1,option2,option3,option4,answer} = req.body
    try {
        await Question.create({
            question,option1,option2,option3,option4,answer
        })
        res.status(201).redirect('/')
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

app.get('/question',checkApiKey, async (req,res) => {
    let select = req.query.select
    try {
        if(select) {
            let selectFix = select.split(",").join(" ")
            const questions = await Question.find().select(selectFix)
            res.status(200).json(questions)
        } else {
            const questions = await Question.find()
            res.status(200).json(questions)
        }
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

app.get('/question/:id',checkApiKey, async (req,res) => {
    const id = req.params.id
    try {
        const question = await Question.findById(id) 
        res.status(200).json(question)
    } catch (error) {
        res.status(404).json({message:error.message})
    }
})

async function checkApiKey(req,res,next) {    
    try {
        const apikey = await APIKEY.findById(req.query.api_key)
        if(apikey==null) {
            return res.status(404).json({message:'Invalid API Key'})
        }  
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
    next()
}

app.listen(PORT)