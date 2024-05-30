import { useEffect, useState } from "react";
import { Link } from "../../types/Link";
import { Response } from "../../types/Response";
import './Links.css'

export const Links = () => {
  const [links, setLinks] = useState<Link[] | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/url-shortener/api/V1/link/all-links')
      .then((result) => result.json())
      .then((response: Response) => response.linkDtoList)
      .then(setLinks);
  }, []);

  return (
    <div className="table-title">
      <h1>Links</h1>
      <div className="table">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Short Link</th>
                <th>Original Link</th>
                <th>Status</th>
                <th>Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {links &&
                links.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <a href={`http://localhost:8080/url-shortener/${link.shortLink}`}>{link.shortLink}</a>
                    </td>
                    <td>
                      <a href={link.longLink}>{link.longLink}</a>
                    </td>
                    <td>{link.status}</td>
                    <td>{link.expirationTime.slice(0, 10)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

