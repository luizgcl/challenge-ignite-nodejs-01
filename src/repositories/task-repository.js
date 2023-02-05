import { randomUUID } from 'node:crypto';

export class TaskRepository {
  #database;

  constructor(database) {
    this.#database = database;
  }

  find() {
    return {
      get: () => this.#database.select('tasks'),
      search: (params) => this.#database.select('tasks', params)
    };
  }

  findById(id) {
    const [task] = this.find().search({ id });
    return task;
  }

  findAll() {
    const tasks = this.find().get();
    return tasks;
  }

  findBy(params) {
    const tasks = this.find().search(params);
    return tasks;
  }

  create(data) {
    this.#database.insert('tasks', {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null
    });
  }

  update(id, data) {
    this.#database.update('tasks', id, data);
  }

  delete(id) {
    this.#database.delete('tasks', id)
  }
}