import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const CLIENT_URL = BASE_URL + "clients/"

const getAll = async () => {
  try {
    // get all schools
    const endpoint = CLIENT_URL;

    const response = await axios.get(endpoint)
    return response.data;
  } catch (e) {
    console.log (e)
  }
}

const create = async (name, address) => {
  try {
    const endpoint = CLIENT_URL + "create"

    const response = await axios.put(endpoint, { name, address })
    return response.data;
  } catch (e) {
    console.log(e)
  }
}
const update = async (id, name, email) => {
  try {
    const endpoint = CLIENT_URL + "update"

    const response = await axios.patch(endpoint, { id, name, email })
    return response.data;
  } catch (e) {
    console.log(e)
  }
}
const getByID = async (id) => {
  try {
    const endpoint = CLIENT_URL + id

    const response = await axios.get(endpoint)
    return response.data;
  } catch (e) {
    console.log(e)
  }
}
const remove = async (id) => {
  try {
    const endpoint = CLIENT_URL + id

    const response = await axios.delete(endpoint)
    return response.data;
  } catch (e) {
    console.log(e)
  }
}

export {
  getAll,
  create,
  update,
  getByID,
  remove
}
