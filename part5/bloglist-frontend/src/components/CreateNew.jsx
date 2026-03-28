import { useState } from 'react'

const CreateNew = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      createBlog({
        title: title,
        author: author,
        url: url,
      })

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.error(error)
    } finally {
      //
    }
  }

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={title}
              name="title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              name="author"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={url}
              name="url"
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </>
  )
}
export default CreateNew
