import { Database } from "../../database/database.js";
import { TaskRepository } from '../../repositories/task-repository.js';
import { ImportCsvService } from "../../service/import-csv-data-service.js";
import { Exception } from '../exceptions/exception.js';
import { buildRouteParams } from "../utils/route-params.js";

const database = new Database();
const taskRepository = new TaskRepository(database);

export const routes = [
  {
    method: 'GET',
    path: buildRouteParams('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = (
        req.query != {} ?
        taskRepository.findBy({
          title: search,
          description: search,
        }) :
        taskRepository.findAll()
      )
      
      return res.writeHead(200).end(JSON.stringify(tasks));
    }
  },
  {
    method: 'GET',
    path: buildRouteParams('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const task = taskRepository.findById(id);

      if (!task) {
        return new Exception(404, 'Task not found').send(res);
      }

      return res.writeHead(200).end(JSON.stringify(task));
    }
  },
  {
    method: 'POST',
    path: buildRouteParams('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return new Exception(400, 'title is required').send(res);
      }

      if (!description) {
        return new Exception(400, 'description is required').send(res);
      }

      const task = {
        title,
        description
      }

      taskRepository.create(task);

      return res.writeHead(201).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRouteParams('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const task = taskRepository.findById(id);

      if (!task) {
        return new Exception(404, 'Task not found').send(res);
      }

      taskRepository.delete(id);
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRouteParams('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body;
      const { id } = req.params;
      const task = taskRepository.findById(id);

      if (!task) {
        return new Exception(404, 'Task not found').send(res);
      }

      taskRepository.update(id, {
        ...task,
        title,
        description
      })

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRouteParams('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const task = taskRepository.findById(id);

      if (!task) {
        return new Exception(404, 'Task not found').send(res);
      }

      let completedAt = task.completedAt ? null : new Date()

      taskRepository.update(id, { completedAt });

      return res.writeHead(204).end();
    }
  },
  {
    method: 'POST',
    path: buildRouteParams('/tasks/import'),
    handler: (req, res) => {
      const { file } = req;
      
      new ImportCsvService(taskRepository).import(file)
        .then((importedFiles) => {
          return res.writeHead(200).end(JSON.stringify({
            data: `${importedFiles} tasks importadas com sucesso!`
          }));
        })
        .catch((err) => {
          console.error(err);
          return new Exception(500, 'Ocorreu um erro ao importar tasks').send(res);
        });
    }
  }
];