//day3


const express = require('express');

const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const {createProblem, updateProblem, deleteProblem,getProblemById,getAllProblem} = require('../controllers/userProblem');
const userMiddleware = require("../middleware/userMiddleware")



problemRouter.post("/create",adminMiddleware, createProblem);
problemRouter.patch("/update:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete:id",adminMiddleware, deleteProblem);

problemRouter.get("/ProblemById:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
// problemRouter.get("/ProblemSolvedByUser",userMiddleware,solvedAllProblembyUser);

module.exports = problemRouter;