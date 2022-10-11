import assert from 'assert';
import { readFileSync } from 'fs';
import { TestFunction, createWrite, FunctionType } from '@execution-machine/sdk';

const testPostId = 'e74e9d33-8f9a-44e3-b68f-21ef7031d887';
const initialState = {
  posts: [],
  users: [],
}

const testData = {
  addUser: {
    input: {
      functionRole: 'addUser',
      walletAddress: 'Am_iBfzjo5g7VMdlYvLINmk6XRJlA0mg725BZM0hXGk',
      userName: 'codingknite',
      upvotedPosts: [],
      favorites: [],
      bio: 'yolo'
    }
  },
  updateBio: {
    input: {
      functionRole: 'updateBio',
      userName: 'codingknite',
      bio: 'testing this out',
    },
  },
  favorites: {
    input: {
      functionRole: 'addFavorite',
      userName: 'codingknite',
      postID: testPostId
    },
  },
  createPost: {
    input: {
      functionRole: 'createPost',
      postID: testPostId,
      author: {
        userName: 'codingknite',
      },
      timeCreated: new Date().getTime(), // change plain Date
      title: 'Testing Locally',
      url: new URL('https://testinglocally.com'),
      description: 'Description Testing Locally',
      upvotes: 0,
    },
  },
  upvote: {
    input: {
      functionRole: 'upVote',
      postID: testPostId,
      userName: 'codingknite',
    },
  },
  downvote: {
    input: {
      functionRole: 'downVote',
      postID: testPostId,
      userName: 'codingknite',
    },
  },


}

const createUser = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.addUser.input)]
})

const updateBio = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.addUser.input), createWrite(testData.updateBio.input)]
})

const addFavorite = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.addUser.input), createWrite(testData.favorites.input)]

})

const createPost = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.createPost.input)]
})

const upVotePost = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.createPost.input), createWrite(testData.upvote.input)]
})

const downVotePost = await TestFunction({
  functionSource: readFileSync('exm/contract.js'),
  functionType: FunctionType.JAVASCRIPT,
  functionInitState: initialState,
  writes: [createWrite(testData.createPost.input), createWrite(testData.upvote.input), createWrite(testData.downvote.input)]
})



assert(createUser.state.users, [testData.addUser.input]);
assert(createPost.state.posts, [testData.createPost.input]);
assert(updateBio.state.users, [testData.addUser.input, testData.updateBio.input]);
assert(addFavorite.state.users, [testData.addUser.input, testData.favorites.input]);
assert(upVotePost.state.users, [testData.createPost.input, testData.upvote.input]);
assert(downVotePost.state.users, [testData.createPost.input, testData.upvote.input, testData.downvote.input]);