const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Ootd = sequelize.define('Ootd', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
    namaOutfit: { type: DataTypes.STRING, allowNull: false },
    deskripsi: { type: DataTypes.TEXT, allowNull: false },
    imageId: { type: DataTypes.STRING, allowNull: false },
    userId: {
        type: DataTypes.STRING, allowNull: false,
        references: { model: 'Users', key: 'googleId' }
    }
}, { tableName: 'Ootds' });
module.exports = Ootd;