import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../service/Api";

interface PostDetail {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  name: string;
  body: string;
}


function ViewPostDetail() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    getPostDetail();
    getComments();
  }, [id]);

  const getPostDetail = async () => {
    try {
      const response = await fetchData(`/posts/${id}`);
      if (response.error) {
        setError(response.error);
      } else {
        setPostDetail(response);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const getComments = async () => {
    try {
      const response = await fetchData(`/posts/${id}/comments`);
      if (response.error) {
        setError(response.error);
      } else {
        setComments(response);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!postDetail) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="max-w-xs mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-24">
        <div className="bg-gray-100 px-4 py-2">
          <h2 className="text-lg font-medium text-gray-800">Post : {id}</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">User ID</span>
            <span className="text-lg font-medium text-gray-800">
              {postDetail.userId}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Title</span>
            <span className="text-lg font-medium text-gray-800">
              {postDetail.title}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between mb-6">
            <span className="text-sm font-medium text-gray-600">Body</span>
            <span className="text-lg font-medium text-gray-800">
              {postDetail.body}
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/" className="relative">
              <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-gray-700"></span>
              <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-black px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-gray-900 hover:text-yellow-500">
                Back
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg border p-2 my-4 mx-6">
        <h3 className="font-bold">Discussion</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border rounded-md p-3 ml-3 my-3">
              <div className="flex gap-3 items-center">
                <h3 className="font-bold">{comment.name}</h3>
              </div>
              <p className="text-gray-600 mt-2">{comment.body}.</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewPostDetail;
