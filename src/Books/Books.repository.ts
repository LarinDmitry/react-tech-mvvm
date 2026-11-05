import ApiGateway from '../Shared/ApiGateway';

export interface BookDto {
  name: string;
  author: string;
}

class BooksRepository {
  httpGateway = new ApiGateway();

  getBooks = async (): Promise<BookDto[]> => {
    const booksDto = (await this.httpGateway.get('/')) as BookDto[];
    return booksDto;
  };

  addBook = async ({ name, author }: BookDto): Promise<boolean> => {
    const bookAddDto = (await this.httpGateway.post('/books', { name, author })) as {
      status?: string;
    } | null;
    return bookAddDto?.status === 'ok';
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
