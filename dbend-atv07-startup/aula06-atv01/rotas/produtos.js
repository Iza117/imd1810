const express = require('express')
const router = express.Router()
const validarProdutos = require('../middleware/produtos.mid')
const { Produto } = require('../models')

router.post('/', validarProdutos)
router.put('/', validarProdutos)

router.get('/', async (req, res) => {
  const produtos = await Produto.findAll()
  res.json({ produtos: produtos })
})

router.get('/:id', async (req, res) => {
  const produto = await Produto.findByPk(req.params.id)
  res.json({ produto: produto })
})

router.post('/', async (req, res) => {
  const produto = await Produto.create(req.body)
  res.json({ msg: "Produto adicionado com sucesso!" })
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const produto = await Produto.findByPk(id)

  if (produto) {
    produto.nome = req.body.nome
    produto.descricao = req.body.descricao
    produto.preco = req.body.preco
    await produto.save()
    res.json({ msg: "Produto atualizado com sucesso!" })
  } else {
    res.status(400).json({ msg: "Produto não encontrado!" })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  const produto = await Produto.findByPk(id)
  if (produto){
      await produto.destroy()
      res.json({msg: "Produto deletado com sucesso!"})
  }else{
    res.status(400).json({msg: "Produto não encontrado!"})
  }
})

module.exports = router;