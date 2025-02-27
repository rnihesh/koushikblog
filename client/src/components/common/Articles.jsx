import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useForm } from 'react-hook-form' // for form handling

import { getBaseUrl } from "../../utils/config.js";
function Articles() {
  const [articles, setArticles] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { getToken } = useAuth()

  // States for filter selection
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { register, watch } = useForm()

  // get all articles
  async function getArticles() {
    const token = await getToken()
    let res = await axios.get(`${getBaseUrl()}/author-api/articles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.data.message === 'articles') {
      setArticles(res.data.payload)
    } else {
      setError(res.data.message)
    }
  }

  // go to specific article
  function goToArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj })
  }

  useEffect(() => {
    getArticles()
  }, [])

  // Get selected category from the dropdown
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  
  return (
    <div className="container py-5">
      {/* Category Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="category" className="form-label fw-bold text-dark">
          Select a category
        </label>
        <select
          id="category"
          className="form-select shadow-sm"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="All">All</option>
          <option value="programming">Programming</option>
          <option value="AI&ML">AI&ML</option>
          <option value="database">Database</option>
        </select>
      </div>
  
      {error && <p className="text-center text-danger">{error}</p>}
  
      {/* Articles Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {/* Filtering articles based on selected category */}
        {articles
          .filter(
            (articleObj) =>
              selectedCategory === 'All' ||
              articleObj.category === selectedCategory
          )
          .map((articleObj) => (
            <div className="col" key={articleObj.articleId}>
              <div className="card shadow-lg border-light rounded-3 h-100">
                <div className="card-body d-flex flex-column">
                  {/* Author Details */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={articleObj.authorData.profileImageUrl}
                        width="40px"
                        className="rounded-circle"
                        alt="author"
                      />
                      <p className="ms-2 mb-0 text-muted">
                        <small>{articleObj.authorData.nameOfAuthor}</small>
                      </p>
                    </div>
                    {/* Article Category (text style without background) */}
                    <span className="text-muted">{articleObj.category}</span>
                  </div>
  
                  {/* Article Title */}
                  <h5 className="card-title mb-3 text-truncate">{articleObj.title}</h5>
  
                  {/* Article Content (Up to 80 chars) */}
                  <p className="card-text text-muted mb-4 text-truncate">
                    {articleObj.content.substring(0, 80) + '....'}
                  </p>
  
                  {/* Read More Button positioned to the left, no background */}
                  <div className="d-flex justify-content-start mt-auto">
                    <button
                      className="btn btn-link p-0 text-primary"
                      onClick={() => goToArticleById(articleObj)}
                    >
                      Read more
                    </button>
                  </div>
                </div>
  
                {/* Article's Date of Modification */}
                <div className="card-footer bg-light border-0">
                  <small className="text-muted">
                    Last updated on {articleObj.dateOfModification}
                  </small>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
  
}

export default Articles
