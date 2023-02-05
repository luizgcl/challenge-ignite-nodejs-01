import { parse } from "csv-parse";

export class ImportCsvService {
  #tasksRepository;

  constructor(tasksRepository) {
    this.#tasksRepository = tasksRepository;
  }
  
  async import(file) {
    const csvParse = parse({
      delimiter: ',',
      skipEmptyLines: true,
      fromLine: 2 // skip the header line
    });

    const linesParse = file.pipe(csvParse);
    let counter = 0;

    for await (const line of linesParse) {
      const [title, description] = line;

      this.#tasksRepository.create({
        title, 
        description
      });
      counter++;
    }

    return counter;
  }
}