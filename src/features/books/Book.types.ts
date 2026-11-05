export interface BookDto {
  id?: number;
  name: string;
  author: string;
  ownerId?: string;
}

export interface Book {
  key: string;
  name: string;
  author: string;
}

export type NewBook = Pick<Book, 'name' | 'author'>;

export interface StatusDto {
  status: string;
}
