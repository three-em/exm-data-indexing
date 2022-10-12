import React from 'react';
import Post from '../../components/Post';
import { useRouter } from 'next/router';
import { useGettUser } from '../../hooks/useGettUser';
import { PostProps, UserProps } from '../../types';
import { fetchData } from '../../utils/getData';

export async function getServerSideProps() {
  const { posts, users } = await fetchData();

  return {
    props: {
      posts,
      users,
    },
  };
}

const UpvotedPosts = ({
  posts,
  users,
}: {
  posts: PostProps[];
  users: UserProps[];
}) => {
  const { user: queryingUser } = useRouter().query,
    { userName } = useGettUser().currentUser;

  const userUpvotes = users.find(
    (user) => user.userName === userName
  )?.upvotedPosts;

  const upvotedPosts = posts.filter(
    (post) => !userUpvotes?.includes(post.postID)
  );

  return (
    <main>
      {queryingUser === userName ? (
        upvotedPosts?.map((post) => (
          <Post
            key={post.postID}
            num={posts.indexOf(post) + 1}
            title={post.title}
            url={post.url}
            postId={post.postID}
            upvotes={post.upvotes}
            userPosted={post.author.userName}
            timeCreated={post.timeCreated}
            numberOfComments={0}
          />
        ))
      ) : (
        <p>Can&apos;t display this</p>
      )}
    </main>
  );
};

export default UpvotedPosts;
