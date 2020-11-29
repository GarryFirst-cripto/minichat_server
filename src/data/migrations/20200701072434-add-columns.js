export default {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(transaction => Promise.all([
      queryInterface.createTable('commentReactions', {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        isLike: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        userId: {
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        commentId: {
          type: Sequelize.UUID,
          references: {
            model: 'comments',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction }),
      queryInterface.addColumn('users', 'status', {
        type: Sequelize.STRING
      }, { transaction }),
      queryInterface.addColumn('posts', 'deleted', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction }),
      queryInterface.addColumn('comments', 'deleted', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction })
    ])),

  down: queryInterface => queryInterface.sequelize
    .transaction(transaction => Promise.all([
      queryInterface.dropTable('commentReactions', { transaction }),
      queryInterface.removeColumn('users', 'status', { transaction }),
      queryInterface.removeColumn('posts', 'deleted', { transaction }),
      queryInterface.removeColumn('comments', 'deleted', { transaction })
    ]))
};
