import { defineAbility } from '@casl/ability';

const user = {
  id: 1,
  isAdmin: false, // 管理员
};

class Post {
  constructor(attrs) {
    Object.assign(this, attrs);
  }
}

const ability = defineAbility((can, cannot) => {
  can('read', 'all');
  can('update', 'Post', ['content'], { isPublished: false, author: user.id });
  cannot('delete', 'Post');

  if (user.isAdmin) {
    can('update', 'Post');
    can('delete', 'Post');
  }
});

const somePost = new Post({ author: 1, isPublished: false });
somePost;
const flag = ability.can('update', somePost, 'content');
flag; // true
