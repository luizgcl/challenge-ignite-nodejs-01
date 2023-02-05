import { randomUUID } from 'node:crypto';

export class TaskRepository {
  #database;

  constructor(database) {
    this.#database = database;
  }

  findById(id) {
    const [task] = this.#database.select('tasks', { id });
    return task;
  }

  findAll() {
    const tasks = this.#database.select('tasks');
    return tasks;
  }

  findBy(params) {
    const tasks = this.#database.select('tasks', params);
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