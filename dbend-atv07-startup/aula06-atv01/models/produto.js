const { Produto, Tag } = require('../models');

async function criarProduto(req, res) {
  const { nome, descricao, preco, tags } = req.body;

  try {
    // Criar o produto
    const produto = await Produto.create({ nome, descricao, preco });

    // Se houver tags, vamos associá-las ao produto
    if (tags && tags.length > 0) {
      const tagInstances = await Promise.all(
        tags.map(async (tagName) => {
          // Verifica se a tag já existe, se não, cria uma nova
          const [tag] = await Tag.findOrCreate({ where: { nome: tagName } });
          return tag;
        })
      );

      await produto.setTags(tagInstances);  // Associação Many-to-Many
    }

    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o produto' });
  }
}