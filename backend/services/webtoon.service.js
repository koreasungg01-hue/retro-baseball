const fs = require("node:fs/promises");
const path = require("node:path");

const TOON_DIR = path.resolve(__dirname, "../toon");

function validateToon(toon) {
  return (
    toon &&
    typeof toon.id === "string" &&
    typeof toon.title === "string" &&
    typeof toon.author === "string" &&
    typeof toon.genre === "string"
  );
}

async function listToons() {
  let folders;

  try {
    folders = await fs.readdir(TOON_DIR, {
      withFileTypes: true
    });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const results = await Promise.all(
    folders
      .filter(folder => folder.isDirectory())
      .map(async folder => {
        try {
          const file = path.join(
            TOON_DIR,
            folder.name,
            "toon.json"
          );

          const raw = await fs.readFile(file, "utf8");
          const toon = JSON.parse(raw);

          if (!validateToon(toon)) return null;

          return toon;
        } catch {
          return null;
        }
      })
  );

  return results.filter(Boolean);
}

async function searchToons({ q = "", genre = "" } = {}) {
  const toons = await listToons();
  const keyword = q.trim().toLocaleLowerCase("ko");
  const selectedGenre = genre.trim().toLocaleLowerCase("ko");

  return toons.filter(toon => {
    const searchable = [
      toon.title,
      toon.author,
      toon.smalltitle,
      toon.explain,
      toon.genre
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("ko");

    const matchesKeyword =
      !keyword || searchable.includes(keyword);

    const matchesGenre =
      !selectedGenre ||
      String(toon.genre)
        .toLocaleLowerCase("ko")
        .includes(selectedGenre);

    return matchesKeyword && matchesGenre;
  });
}

async function getToonById(id) {
  const toons = await listToons();
  return toons.find(toon => toon.id === id) || null;
}

module.exports = {
  listToons,
  searchToons,
  getToonById
};
