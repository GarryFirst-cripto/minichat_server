export default (orm, DataTypes) => {
  const Comment = orm.define('comment', {
    body: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    deleted: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return Comment;
};
