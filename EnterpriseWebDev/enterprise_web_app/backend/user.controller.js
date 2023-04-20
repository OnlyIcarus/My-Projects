//Taken and adapted from Topic 5 of Enterprise Web Systems

import User from './user.model.js'
import lodash from 'lodash'
import errorHandler from './dbErrorHandler.js'

const create = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:8000/api/users");
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    console.log("Got users" + users)
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


const userByID = async (req, res, next, id) => {
  try {
    console.log("Getting user: " + id)
    let user = await User.findById(id)
    if (!user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user"
    })
  }
}

const userByName = async (req, res, next, id) => {
  try {
    //let user = await User.findById(id)
    console.log("Finding user by name " + id)
    let user = await User.findOne({ name: id });
    if (!user)
      return res.status(400).json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user by name: " + err
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}


const update = async (req, res) => {
  try {
    let user = req.profile
    user = lodash.extend(user, req.body)
    user.updated = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


export default {
  create,
  userByID,
  userByName,
  read,
  list,
  remove,
  update
}
