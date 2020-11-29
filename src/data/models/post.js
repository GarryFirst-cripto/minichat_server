export default (orm, DataTypes) => {
  const Post = orm.define('post', {
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

  return Post;
};
