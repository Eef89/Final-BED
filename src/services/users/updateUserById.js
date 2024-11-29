import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updateUserById = async (
  id,
  username,
  password,
  name,
  email,
  phoneNumber,
  profilePicture
) => {
  const prisma = new PrismaClient();
  const updatedUser = await prisma.user.updateMany({
    where: {
      id,
    },
    data: {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
    },
  });

  if (!updatedUser || updatedUser.count === 0) {
    throw new NotFoundError("User", id);
  }

  return {
    message: `User with id ${id} was updated!`,
  };
};

export default updateUserById;

// import bookData from '../../data/books.json' assert { type: 'json' }
// import NotFoundError from '../../errors/NotFoundError.js'

// const updateBookById = (id, title, author, isbn, pages, available, genre) => {
//   const book = bookData.books.find(book => book.id === id)

//   if (!book) {
//     throw new NotFoundError('Book', id)
//   }

//   book.title = title ?? book.title
//   book.author = author ?? book.author
//   book.isbn = isbn ?? book.isbn
//   book.pages = pages ?? book.pages
//   book.available = available ?? book.available
//   book.genre = genre ?? book.genre

//   return book
// }

// export default updateBookById
