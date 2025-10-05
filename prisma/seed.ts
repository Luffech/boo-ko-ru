import { PrismaClient, ReadingStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const genres = [
    { name: "Ficção Científica" },
    { name: "Fantasia" },
    { name: "Realismo Mágico" },
    { name: "Romance Histórico" },
    { name: "Tecnologia" },
  ];

  await Promise.all(
    genres.map((genre) =>
      prisma.genre.upsert({
        where: { name: genre.name },
        update: {},
        create: genre,
      })
    )
  );

  console.log("Genres created/updated successfully.");

  await prisma.book.deleteMany();

  const createdGenres = await prisma.genre.findMany();
  const getGenreId = (name: string) =>
    createdGenres.find((g) => g.name === name)?.id;

  const books = [
    {
      title: "O Guia do Mochileiro das Galáxias",
      author: "Douglas Adams",
      cover: "/bookoru-capa.jpeg",
      year: 1979,
      pages: 208,
      currentPage: 50,
      rating: 4,
      synopsis: "As desventuras de Arthur Dent após a destruição da Terra e sua viagem pela galáxia com um guia de viagem excêntrico.",
      status: ReadingStatus.LENDO,
      genreId: getGenreId("Ficção Científica"),
    },
    {
      title: "Cem Anos de Solidão",
      author: "Gabriel García Márquez",
      cover: "/bookoru-capa.jpeg",
      year: 1967,
      pages: 417,
      currentPage: 417,
      rating: 5,
      synopsis: "A história da família Buendía na fictícia Macondo, um marco do realismo mágico latino-americano.",
      status: ReadingStatus.LIDO,
      genreId: getGenreId("Realismo Mágico"),
    },
    {
      title: "O Nome do Vento",
      author: "Patrick Rothfuss",
      cover: "/bookoru-capa.jpeg",
      year: 2007,
      pages: 656,
      currentPage: 0,
      rating: 0,
      synopsis: "O primeiro livro da Crônica do Matador do Rei. A história de Kvothe, um mago e músico lendário.",
      status: ReadingStatus.QUERO_LER,
      genreId: getGenreId("Fantasia"),
    },
    {
      title: "A Revolução do Software",
      author: "Steve McConnell",
      cover: "/bookoru-capa.jpeg",
      year: 2004,
      pages: 960,
      currentPage: 0,
      rating: 0,
      synopsis: "Um guia fundamental sobre as melhores práticas de engenharia de software.",
      status: ReadingStatus.PAUSADO,
      genreId: getGenreId("Tecnologia"),
    },
    {
      title: "Pilar de Fogo",
      author: "Ken Follett",
      cover: "/bookoru-capa.jpeg",
      year: 2017,
      pages: 900,
      currentPage: 150,
      rating: 3,
      synopsis: "Um épico ambientado na Europa do século XVI, durante as guerras religiosas.",
      status: ReadingStatus.LENDO,
      genreId: getGenreId("Romance Histórico"),
    },
  ];

  await prisma.book.createMany({ data: books });

  console.log(`Successfully created ${books.length} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });