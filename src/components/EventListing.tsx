import {useEffect, useState} from "react";
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
    const initialFavImg = JSON.parse(localStorage.getItem('favs') || '[]')
    const [favouriteImg, setFavouriteImg] = useState<any[]>(initialFavImg);

    const convertDateToMonthName = (d:any) => {
        let date = d.split(".")
        let newDate = new Date(date[2], date[1] , date[0])
        newDate.setMonth(newDate.getMonth() - 1);
        let monthName = newDate.toLocaleString('en-us', { month: 'long' });
        return monthName;
    }

    const getMonthsByDate = (dateList:any) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let monthInOrderList: string[] = [];
        let monthList: string[] = [];
        dateList.map((d: any)=> {
            let monthName = convertDateToMonthName(d);
            monthList.push(monthName);
        })

        let um = monthList.filter((val,id,array) => array.indexOf(val) === id);
        
        months.forEach(month => {
            if (um.includes(month)) {
                monthInOrderList.push(month);
            }
        })
    
        return monthInOrderList;
    }

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/xsolla/test-task-frontend/master/events.json", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then((res) => res.json())
        .then(
            (result) => {
                setEventData(result);
            },

            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                console.log(error)
            }
        );
    }, []);

    useEffect(() => {
        if (eventData !== null) {
            setFilterEvent(eventData);
            const citys = eventData.map((event: any) => { return event.city });
            const date = eventData.map((event: any) => { return event.date });
            const uniqueCityList = citys.filter((val: any, id: any, array: string | any[]) => array.indexOf(val) === id);
            const uniqueMonthList = getMonthsByDate(date);
            uniqueCityList.unshift("");
            uniqueMonthList.unshift("");
            setCityArr(uniqueCityList);
            setMonthArr(uniqueMonthList)
        }
    }, [eventData])

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

    const handleImageChange = (id: any,i: number) => {
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

    const filterByCity = (event: any[]) => {

        // Avoid filter for null value
        if (!selectedCity || selectedCity === "") {
            return event;
          }
        
        let filteredEventByCity = event.filter((e)=> {
            return e.city === selectedCity
        });
        return filteredEventByCity
    }

    const filterByMonth = (event: any[]) => {

        // Avoid filter for null value
        if (!selectedMonth || selectedMonth === "") {
            return event;
        }

        let filteredEventByMonth = event.filter((e)=> {
            let m = convertDateToMonthName(e.date)
            return m === selectedMonth
        });
        return filteredEventByMonth
    }

    const filterByFav = (event: any[]) => {

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