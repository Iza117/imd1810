const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2)
    }
});

const Tag = sequelize.define('Tag', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Product.belongsToMany(Tag, { through: 'ProductTag' });
Tag.belongsToMany(Product, { through: 'ProductTag' });

sequelize.sync().then(() => {
    console.log("As tabelas foram sincronizadas!");
}).catch((error) => {
    console.error('Erro ao sincronizar as tabelas:', error);
});

const app = express();
app.use(express.json());

app.post('/products', async (req, res) => {
    const { name, description, price, tags } = req.body;

    try {

        const product = await Product.create({ name, description, price });

        if (tags && tags.length > 0) {
            const tagInstances = await Promise.all(tags.map(tag => Tag.findOrCreate({ where: { name: tag } })));
            await product.setTags(tagInstances.map(t => t[0]));
        }

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll({ include: Tag });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});