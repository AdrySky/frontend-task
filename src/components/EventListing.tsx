import {useEffect, useState} from "react";
import axios from "axios";
function EventListing() {
    const [eventData, setEventData] = useState<any[]>([]);
    useEffect(() => {
        axios.get("https://raw.githubusercontent.com/xsolla/test-task-frontend/master/events.json")
            .then((response) => {
                setEventData(response.data)
                setFilterEvent(response.data);
            });
    }, []);


  return (
          <ul className="list">
              {filterEvent.map((post,i) => (
                  <li className="item" key={post.id}>
                      <div className="image" style={{ backgroundImage: `url(${post.image})` }} onClick={()=>handleImageChange(post.id,i)}>
                          <h4 className="description">{post.name}</h4>
                      </div>
                  </li>
              ))}
          </ul>
  );
}

export default EventListing;