export default (orm, DataTypes) => {
  const CommentReaction = orm.define('commentReaction', {
    isLike: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return CommentReaction;
};
