import React from 'react';
import { mangaDexImageUrl } from '../../config/url';
import './manga.css';
import {useNavigate} from 'react-router-dom'

export const MangaComponent = ({ manga }) => {
  const enTitle = manga.attributes.title.en
  const jpnTitle = manga.attributes.title.ja
  const navigate = useNavigate()

  const getMangaStatus = (status) => {
    switch (status) {
      case 'ongoing':
        return <span className="banner ongoing">Ongoing</span>;
      case 'completed':
        return <span className="banner completed">Completed</span>;
      case 'canceled':
        return <span className="banner canceled">Canceled</span>;
      default:
        return null;
    }
  };

  const truncatedTitle = (title, maxLines) => {
    const words = title.split(' ');
    let currentLine = '';
    let lines = 0;

    for (const word of words) {
      if (lines >= maxLines) {
        break;
      }

      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testDiv = document.createElement('div');
      testDiv.style.visibility = 'hidden';
      testDiv.style.position = 'absolute';
      testDiv.style.width = 'auto';
      testDiv.style.whiteSpace = 'nowrap';
      testDiv.textContent = testLine;
      document.body.appendChild(testDiv);

      if (testDiv.clientWidth <= 180) {
        currentLine = testLine;
      } else {
        lines++;
        currentLine = word;
      }

      document.body.removeChild(testDiv);
    }

    return currentLine;
  };

  const toMangaDetailss = (id) => {
    navigate(`/manga/${id}`)
  }

  return (
    <div key={manga.id} className="card" onClick={() => toMangaDetailss(manga.id)}>
      {getMangaStatus(manga.attributes.status)}
      <img
        src={
          mangaDexImageUrl +
          manga.id +
          '/' +
          manga.relationships.find((rel) => rel.type === 'cover_art').attributes.fileName
        }
        alt="Manga Cover"
        className="cover-manga"
      />
      <div className="manga-info">
        <h6 className="title">{enTitle ? enTitle : jpnTitle}</h6>
        {/* Display manga genres */}
      </div>
        <div className="genre-tags">
          {manga.attributes.tags.slice(0, 3).map((tag) => (
            <span className="genre" key={tag.id}>
              {tag.attributes.name.en}
            </span>
          ))}
        </div>
    </div>
  );
};
