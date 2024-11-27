
import axios from 'axios'
// import fs from 'node:fs/promises'


async function fetchAPIByPage(page = 1, counter=1) {
  const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`)
  // await fs.writeFile('get-page02.json', JSON.stringify(data))
  const result = data?.results?.slice(0, counter).map(item => {
    return {
      id: item.id,
      name: item.name,
      image: item.image
    }
  })

  return result
}

export { fetchAPIByPage }



