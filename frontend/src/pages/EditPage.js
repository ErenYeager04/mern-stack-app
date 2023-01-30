import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigate } from "react-router-dom"


const EditPage = () => {
  const [title, setTitle] = useState('')
  const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])
  const url = new URL(window.location.href);
  const id = url.pathname.split('/')[2];
  const {user} = useAuthContext()
  let navigate = useNavigate(); 
  


  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(`/api/workouts/${id}`,
      {headers: {
        'Authorization': `Bearer ${user.token}`
      }})
      const json = await response.json()

      if (!response.ok) {
        setError(json.error)
        setEmptyFields(json.emptyFields)
      }
  
      if (response.ok) {
        
        setError(null)
        setEmptyFields([])
        setTitle(json.title)
        setLoad(json.load)
        setReps(json.reps)

      }
  
    }
    fetchWorkouts()
    
  }, [user, id])
    

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!user) {
      setError('You must be logged in')
      return

    }

    const workout = {title, load, reps}
    
    const update = await fetch(`/api/workouts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await update.json()
    if (!update.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }

    if (update.ok) {
      let path = `/`; 
      navigate(path);
    }
  }

  return (
    <form className="create edit-form" onSubmit={handleSubmit} > 
      <h3>Edit the workout</h3>

      <label>Excersize Title:</label>
      <input 
        type="text" 
        onChange={(e) => setTitle(e.target.value)} 
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Load (in kg):</label>
      <input 
        type="number" 
        onChange={(e) => setLoad(e.target.value)} 
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
      />

      <label>Number of Reps:</label>
      <input 
        type="number" 
        onChange={(e) => setReps(e.target.value)} 
        value={reps} 
        className={emptyFields.includes('reps') ? 'error' : ''}
      />

      <button>Save</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default EditPage

