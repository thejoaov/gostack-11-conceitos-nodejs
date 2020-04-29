const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/", (request, response) => {
  return response.json({ message: "Hello World!" });
});

app.get("/repositories", (request, response) => {
  try {
    const { title } = request.query;

    const results = title
      ? repositories.filter((repository) => repository.title.includes(title))
      : repositories;

    response.status(200).json(results);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

app.post("/repositories", (request, response) => {
  try {
    const { title, url, techs } = request.body;

    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0,
    };

    repositories.push(repository);

    response.status(201).json(repository);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

app.put("/repositories/:id", (request, response) => {
  try {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex < 0) {
      throw new Error("Project not found");
    }

    const countLikes = repositories[repositoryIndex].likes;

    const repository = {
      id,
      title,
      url,
      techs,
      likes: countLikes,
    };

    repositories[repositoryIndex] = repository;

    response.status(200).json(repository);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

app.delete("/repositories/:id", (request, response) => {
  try {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex < 0) {
      throw new Error("Project not found");
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

app.post("/repositories/:id/like", (request, response) => {
  try {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex > 0) {
      throw new Error("Project not found");
    }

    repositories[repositoryIndex].likes += 1;

    response.status(200).json(repositories[repositoryIndex]);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

module.exports = app;
