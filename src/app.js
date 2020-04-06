const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/** List all repositories */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/** Create new repository */
/*
POST /repositories: The route must receive title, url and techs within the body of the request, with the URL being the link to the github of this repository. When registering a new project, it must be stored inside an object in the following format: {id: "uuid", title: 'Desafio Node.js', techs: ["Node.js", "..."], likes: 0}; Make sure the ID is a UUID, and always start the likes as 0.
*/
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

/** Edit repository */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found! That was close!'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

/** Delete repository */
app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({error: 'Repository not found! Try again later, maybe someone will create so you can delete :P'});
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

/** Increase Like, no restriction specified, so unlimited. */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found! Try again later, maybe someone will create so you will like! :P'});
  }

  repositories[repositoryIndex].likes++;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
