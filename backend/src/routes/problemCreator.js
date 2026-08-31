//day3


const express = require('express');
const problemRouter = express.Router();



problemRouter.post("/create",problemCreate);
problemRouter.patch("/:id",problemUpdate);
problemRouter.delete("/:id",problemDelete);

problemRouter.get("/:id",problemFetch);
problemRouter.get("/",problemFetchAll);
problemRouter.get("/user",solvedProblem);

module.exports = problemRouter;