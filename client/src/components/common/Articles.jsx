import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useForm } from 'react-hook-form' // for form handling

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
    let res = await axios.get('http://localhost:3000/author-api/articles', {
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
    <div className="container">
      <div className="mb-4">
        {/* Category Filter Dropdown */}
        <label htmlFor="category" className="form-label fw-bold">
          Select a category
        </label>
        <select
          id="category"
          className="form-select"
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

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
        {/* Filtering articles based on selected category */}
        {articles
          .filter(
            (articleObj) =>
              selectedCategory === 'All' ||
              articleObj.category === selectedCategory
          )
          .map((articleObj) => (
            <div className="col" key={articleObj.articleId}>
              <div className="card h-100">
                <div className="card-body">
                  {/* Author Image */}
                  <div className="author-details text-end">
                    <img
                      src={articleObj.authorData.profileImageUrl}
                      width="40px"
                      className="rounded-circle"
                      alt=""
                    />
                    {/* Author Name */}
                    <p>
                      <small className="text-secondary">
                        {articleObj.authorData.nameOfAuthor}
                      </small>
                    </p>
                  </div>
                  {/* Article Title */}
                  <h5 className="card-title">{articleObj.title}</h5>
                  {/* Article Content (Up to 80 chars) */}
                  <p className="card-text">
                    {articleObj.content.substring(0, 80) + '....'}
                  </p>
                  {/* Read More Button */}
                  <button
                    className="custom-btn btn-4"
                    onClick={() => goToArticleById(articleObj)}
                  >
                    Read more
                  </button>
                </div>
                <div className="card-footer">
                  {/* Article's Date of Modification */}
                  <small className="text-body-secondary">
                    Last updated on {articleObj.dateOfModification}
                  </small>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Articles
