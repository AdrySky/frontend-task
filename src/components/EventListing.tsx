import {useEffect, useState} from "react";
import axios from "axios";
import { ReactComponent as NotFavourite } from "../not-favourite.svg";
import { ReactComponent as Favourited } from "../favourite.svg";

function EventListing() {
    const [eventData, setEventData] = useState<any[]>([]);
    const [filterEvent, setFilterEvent] = useState<any[]>([]);
    const [cityArr, setCityArr] = useState<any[]>([]);
    const [monthArr, setMonthArr] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedFav, setSelectedFav] = useState<boolean>(false);
    const [favouriteImg, setFavouriteImg] = useState<any[]>(JSON.parse(localStorage.getItem('favs')));

    const convertDateToMonthName = (d) => {
        let date = d.split(".")
        let newDate = new Date(date[2], date[1] , date[0])
        newDate.setMonth(newDate.getMonth() - 1);
        let monthName = newDate.toLocaleString('en-us', { month: 'long' });
        return monthName;
    }

    const convertToMonthName = (arr) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let resultArray = [];
        let monthArr = []
        arr.map((d)=> {
            let monthName = convertDateToMonthName(d);
            monthArr.push(monthName);
        })

        let um = monthArr.filter((val,id,array) => array.indexOf(val) == id);
        
        months.forEach(month => {
            if (um.includes(month)) {
                resultArray.push(month);
            }
        })
    
        return resultArray;
    }

    useEffect(() => {
        axios.get("https://raw.githubusercontent.com/xsolla/test-task-frontend/master/events.json")
            .then((response) => {
                setEventData(response.data)
                setFilterEvent(response.data);
                const citys = response.data.map((event:any) => { return event.city });
                const months = response.data.map((event:any) => { return event.date });
                const uniqueCity = citys.filter((val,id,array) => array.indexOf(val) == id);
                let m = convertToMonthName(months);
                uniqueCity.unshift("")
                m.unshift("")
                setCityArr(uniqueCity)
                setMonthArr(m)
            });
    }, []);

    // Update selectedCity state
    const handleCityChange = ( event : any) => {
        let val = event.target.value;
        setSelectedCity(val);
    };
    
    // Toggle selectedMonth state
    const handleMonthChange = ( event : any) => {
        let val = event.target.value;
        setSelectedMonth(val);
    };

    // Toggle selectedFav state
    const handleFavChange = ( event : any) => {
        let val = event.target.checked;
        setSelectedFav(val);
    };

    const handleImageChange = (id,i) => {
        let newFavouriteImg = [...favouriteImg];
        if(newFavouriteImg.includes(id)){
            let index = newFavouriteImg.indexOf(id)
            newFavouriteImg[index] = "";
        } else {
            newFavouriteImg[i] = id;
        }
        setFavouriteImg(newFavouriteImg);
        localStorage.setItem('favs', JSON.stringify(newFavouriteImg))
    }

    const filterByCity = (event) => {

        // Avoid filter for null value
        if (!selectedCity || selectedCity == "") {
            return event;
          }
        
        let filteredEventByCity = event.filter((e)=> {
            return e.city == selectedCity
        });
        return filteredEventByCity
    }

    const filterByMonth = (event) => {

        // Avoid filter for null value
        if (!selectedMonth || selectedMonth == "") {
            return event;
        }

        let filteredEventByMonth = event.filter((e)=> {
            let m = convertDateToMonthName(e.date)
            return m == selectedMonth
        });
        return filteredEventByMonth
    }

    const filterByFav = (event) => {

        // Avoid filter for null value
        if (!selectedFav) {
            return event;
        }
        let filteredEventByFav = event.filter((e)=> {
            return favouriteImg.includes(e.id)
        });
        return filteredEventByFav;
    }

    useEffect(()=> {
        if(filterEvent != null) {
            let filteredData = filterByCity(eventData);
            filteredData = filterByMonth(filteredData);
            filteredData = filterByFav(filteredData);
            setFilterEvent(filteredData);
        }
    },[selectedCity,selectedMonth, selectedFav])

  return (
      <div>
          <div className="dropdown">
              <label className="drop-title">City: </label>
              <select id="city" value={selectedCity} onChange={(e) => handleCityChange(e)}>
                  {cityArr.map((option) => {
                      return (<option key={option} value={option}>{option}</option>)
                  })}
              </select>
              <label className="drop-title">Month: </label>
              <select id="month" value={selectedMonth} onChange={(e) => handleMonthChange(e)}>
                  {monthArr.map((option) => {
                      return (<option key={option} value={option}>{option}</option>)
                  })}
              </select>
              <label className="drop-title">Favourite: </label>
              <input id="fav" type="checkbox" value="Fav" onChange={(e) => handleFavChange(e)}/>
          </div>
          <ul className="list">
              {filterEvent.map((post,i) => (
                  <li className="item" key={post.id}>
                      <div className="image" style={{ backgroundImage: `url(${post.image})` }} onClick={()=>handleImageChange(post.id,i)}>
                              <p className="day">{post.date.split(".")[0]}</p>
                              <div className="favourite" >
                                {favouriteImg.includes(post.id) ? <Favourited /> : <NotFavourite />}
                              </div>
                          <h4 className="description">{post.name}</h4>
                      </div>
                  </li>
              ))}
          </ul>
      </div>
  );
}

export default EventListing;