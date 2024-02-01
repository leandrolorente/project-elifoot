import express from "express";
import { addUser, deleteUser, getUserByToken, getUserElifoot, getUsers, updateUser } from "../controllers/user.js";

const router = express.Router()

router.get("/", getUsers)

router.get("/byEmail/:email", getUserElifoot)

router.get("/byToken/:token", getUserByToken);

router.post("/", addUser)

router.put("/:id", updateUser)

router.delete("/:id", deleteUser)

export default router