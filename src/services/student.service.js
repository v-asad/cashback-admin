import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const STUDENT_URL = BASE_URL + 'students/'

const getAll = async () => {
  try {
    // get all Teachers
    const endpoint = STUDENT_URL

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByClientId = async clientId => {
  try {
    // get all Teachers
    const endpoint = STUDENT_URL + 'client/' + clientId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const getByGradeId = async gradeId => {
  try {
    // get all Teachers
    const endpoint = STUDENT_URL + 'grade/' + gradeId

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const create = async (name, nameAr, gender, parentEmail, parentPhoneNo, clientId, schoolId, gradeId) => {
  try {
    const endpoint = STUDENT_URL + 'create'

    const response = await axios.put(endpoint, {
      name,
      nameAr,
      gender,
      parentEmail,
      parentPhoneNo,
      clientId,
      schoolId,
      gradeId
    })
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const update = async (id, name, Phone, email, parentId, password, gradeId) => {
  try {
    const endpoint = STUDENT_URL + 'update'

    const response = await axios.patch(endpoint, {
      id,
      name,
      Phone,
      email,
      parentId,
      password,
      gradeId
    })

    return response.data
  } catch (e) {
    console.log(e)
  }
}

const getByID = async id => {
  try {
    const endpoint = STUDENT_URL + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const remove = async id => {
  try {
    const endpoint = STUDENT_URL + id

    const response = await axios.delete(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
const sendStundetCredentials = async id => {
  try {
    const endpoint = STUDENT_URL + 'sendEmail/' + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
export { getAll, getByClientId, getByGradeId, create, update, getByID, sendStundetCredentials, remove }
