import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createData, deleteData, fetchData, updateData } from "../service/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState({ name: "", body: "" });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const handleEdit = (comment: Comment) => {
    setIsEditMode(true);
    setEditingCommentId(comment.id);
    setNewComment({ name: comment.name, body: comment.body });
    handleShow();
  };

  const handleDelete = async (commentId: number) => {
    const response = await deleteData(`/comments/${commentId}`);
    if ("error" in response) {
      setError(response.error);
    } else {
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully!");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode && editingCommentId !== null) {
      const endpoint = `/comments/${editingCommentId}`;
      const response = await updateData(endpoint, newComment);

      if ("error" in response) {
        setError(response.error);
      } else {
        setComments(
          comments.map((comment) =>
            comment.id === editingCommentId
              ? { ...comment, ...newComment }
              : comment
          )
        );
        setShow(false);
        toast.success("Comment updated successfully!");
      }
    } else {
      const endpoint = `/posts/${id}/comments`;
      const response = await createData(endpoint, newComment);

      if ("error" in response) {
        setError(response.error);
      } else {
        setComments([{ id: Date.now(), ...newComment }, ...comments]);
        setShow(false);
        toast.success("Comment created successfully!");
      }
    }

    setIsEditMode(false);
    setEditingCommentId(null);
    setNewComment({ name: "", body: "" });
  };

  if (!postDetail) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <ToastContainer />
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

      <button className="bg-zinc-300 font-semibold text-black p-2 my-4 mx-6 rounded transition duration-300 ease-in-out transform hover:bg-orange-600 hover:text-white hover:scale-105" onClick={handleShow}>
        Add new Comment
      </button>
      <div className="w-auto bg-blue-400 rounded-lg border p-2 my-4 mx-6">
        <h3 className="font-bold">Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border w-auto bg-white rounded-md p-3 ml-3 my-3">
              <div className="flex gap-3 items-center">
                <h3 className="font-bold">{comment.name}</h3>
              </div>
              <p className="text-gray-600 mt-2">{comment.body}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(comment)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Comment" : "Add Comment"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Commenter Name
              </label>
              <input
                type="text"
                className="form-control"
                value={newComment.name}
                id="name"
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="body" className="form-label">
                Comment Body
              </label>
              <textarea
                className="form-control"
                id="body"
                value={newComment.body}
                onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
              ></textarea>
            </div>
            <Button variant="primary" type="submit">
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewPostDetail;
