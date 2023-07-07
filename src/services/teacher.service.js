import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const TEACHER_URL = BASE_URL + 'teachers/'

const getAll = async () => {
  try {
    // get all Teachers
    const endpoint = TEACHER_URL

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientId = async clientId => {
  try {
    // get all Teachers
    const endpoint = TEACHER_URL + 'client/' + clientId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getBySchoolId = async schoolId => {
  try {
    const endpoint = TEACHER_URL + 'school/' + schoolId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const create = async (name, nameAr, email, password, clientId, schoolId) => {
  try {
    const endpoint = TEACHER_URL + 'create'

    const response = await axios.put(endpoint, { name, nameAr, password, email, clientId, schoolId })
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const update = async (id, name, nameAr, email) => {
  try {
    const endpoint = TEACHER_URL + 'update'

    const response = await axios.patch(endpoint, { id, name, nameAr, email })
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByID = async id => {
  try {
    const endpoint = TEACHER_URL + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const remove = async id => {
  try {
    const endpoint = TEACHER_URL + id

    const response = await axios.delete(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const sendTeacherCredentials = async id => {
  const endpoint = TEACHER_URL + 'sendEmail/' + id
  try {
    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export { getAll, getByClientId, create, update, getByID, remove, getBySchoolId, sendTeacherCredentials }
