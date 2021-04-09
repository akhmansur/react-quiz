import axios from 'axios';

export default axios.create({
  baseURL: 'https://react-quiz-52d3f-default-rtdb.firebaseio.com/'
})
