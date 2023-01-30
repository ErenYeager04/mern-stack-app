import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigate } from "react-router-dom"


// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  let navigate = useNavigate(); 


  const handleClick = async () => {
    if (!user) {
      return
    }
    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_WORKOUT', payload: json})
    }
  }

  const handleRedirect = () => {
    let path = `/edit/${workout._id}`; 
    navigate(path);
  }

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p><strong>Load (kg): </strong>{workout.load}</p>
      <p><strong>Reps: </strong>{workout.reps}</p>
      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true})}</p>
      
        <span style={{ display: 'inline-block', marginTop: '40px' }} className="material-symbols-outlined" onClick={handleClick}>
          Delete
        </span>
        <span style={{ display: 'inline-block' }} className="material-icons-outlined" onClick={handleRedirect}>
          <i className="fas fa-pencil-alt" /> Edit
        </span>
      
    </div>
    
  )
}

export default WorkoutDetails