import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import { getBaseUrl } from "../../utils/config.js";
function ArticleByID() {
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);
  const [editArticelStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");
  //console.log(state)
  function enableEdit() {
    setEditArticleStatus(true);
  }
  async function onSave(modifiedArticle) {
    const articleAfterChanges = { ...state, ...modifiedArticle };
    const token = await getToken();
    const currentDate = new Date();
    //change date of mofification
    articleAfterChanges.dateOfModification =
      currentDate.getDate() +
      "-" +
      currentDate.getMonth() +
      "-" +
      currentDate.getFullYear();
    let res = await axios.put(
      `${getBaseUrl()}0/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.message == "Article modified") {
      setEditArticleStatus(false);
      navigate(`/author-profile/articles/${state.articleId}`, {
        state: res.data.payload,
      });
    }
  }

  async function addComment(commentObj) {
    commentObj.nameOfUser = currentUser.firstName;
    console.log(commentObj);
    let res = await axios.put(
      `${getBaseUrl()}/user-api/comment/${currentArticle.articleId}`,
      commentObj
    );
    if (res.data.message === "comment added") {
      setCommentStatus(res.data.message);
    }
  }

  async function deleteArticle() {
    state.isArticleActive = false;
    let res = await axios.put(
      `${getBaseUrl()}/author-api/articles/${state.articleId}`,
      state
    );
    if (res.data.message == "Article deleted or restored") {
      setCurrentArticle(res.data.payload);
    }
  }

  async function restoreArticle() {
    state.isArticleActive = true;
    let res = await axios.put(
      `${getBaseUrl()}/author-api/articles/${state.articleId}`,
      state
    );
    if (res.data.message == "Article deleted or restored") {
      setCurrentArticle(res.data.payload);
    }
  }
  return (
    <div className="container py-5">
      {editArticelStatus == false ? (
        <> 
          {/* Full Article Display */}
          <div className="card shadow-lg rounded-3">
            <div className="card-body">
              {/* Flex Container for Title, Meta Information and Author */}
              <div className="d-flex justify-content-between mb-4">
                <div className="w-75">
                  <p className="display-3 mb-2">{state.title}</p>
                  <span className="py-3">
                    <small className="text-muted me-4">
                      Created on : {state.dateOfCreation}
                    </small>
                    <small className="text-muted">
                      Modified on : {state.dateOfModification}
                    </small>
                  </span>
                </div>

                {/* Author Details Section */}
                <div className="d-flex flex-column align-items-center justify-content-center text-center">
                  <img
                    src={state.authorData.profileImageUrl}
                    width="60px"
                    className="rounded-circle"
                    alt="Author"
                  />
                  <p>{state.authorData.nameOfAuthor}</p>
                </div>
              </div>

              {/* Actions (Edit/Delete) Buttons - Aligned Right */}
              {currentUser.role === "author" && (
                <div className="d-flex justify-content-end">
                  {/* Edit Button */}
                  <button className="btn btn-light me-2" onClick={enableEdit}>
                    <FaEdit className="text-warning" />
                  </button>
                  {/* Delete or Restore Button */}
                  {state.isArticleActive ? (
                    <button className="btn btn-light" onClick={deleteArticle}>
                      <MdDelete className="text-danger fs-4" />
                    </button>
                  ) : (
                    <button className="btn btn-light" onClick={restoreArticle}>
                      <MdRestore className="text-info fs-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Article Content */}
              <p
                className="lead mt-3 article-content"
                style={{ whiteSpace: "pre-line" }}
              >
                {state.content}
              </p>

              {/* User Comments Section */}
              <div className="bg-light p-4 rounded-3 shadow-sm my-4">
                <h3 className="mb-4">User Comments</h3>
                <div className="comments">
                  {state.comments.length === 0 ? (
                    <p
                      className="text-center text-muted"
                      style={{ fontSize: "14px" }}
                    >
                      No comments yet...
                    </p>
                  ) : (
                    state.comments.map((commentObj) => (
                      <div
                        key={commentObj._id}
                        className="comment-box mb-3 p-3 shadow-sm bg-white"
                        style={{ border: "none" }} // Removed the border here
                      >
                        <p className="user-name font-weight-bold">
                          {commentObj?.nameOfUser}
                        </p>
                        <p className="comment">{commentObj?.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Comment Form for Users */}
              {currentUser.role === "user" && (
                <form onSubmit={handleSubmit(addComment)}>
                  <div className="mb-4">
                    <label htmlFor="comment" className="form-label">
                      Add a Comment
                    </label>
                    <input
                      type="text"
                      {...register("comment")}
                      className="form-control"
                      placeholder="Enter your comment here"
                    />
                  </div>
                  <button className="btn btn-success">Add a comment</button>
                </form>
              )}
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSave)}>
          <div className="card shadow-lg rounded-3 p-4">
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                defaultValue={state.title}
                {...register("title")}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Select a category
              </label>
              <select
                {...register("category")}
                id="category"
                className="form-select"
                defaultValue={state.category}
              >
                <option value="programming">Programming</option>
                <option value="AI&ML">AI&ML</option>
                <option value="database">Database</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                {...register("content")}
                className="form-control"
                id="content"
                rows="10"
                defaultValue={state.content}
              ></textarea>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default ArticleByID;
