import './App.css';
import React, { useState } from "react";
import axios from "axios";
import { Table } from "antd";
import {BrowserRouter,Routes, Route, Link} from "react-router-dom";
import Pricing from "./components/Pricing.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/pricing/:menu_item' element = {<Pricing/>} />
          <Route path='/recipe/:menu_item' element = {<Recipe/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const Home = () => {
  const [restaurantName, setRestaurantName] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleCuisine = async (e) => {
    setLoading(true);
    const cuisine = e.target.value;
    const data = {
      "prompt": "I want to start restaurant in india. Suggest me only one restaurant name for " + cuisine + " cuisines along with menu items, description about each menu item, without any additonal description and explanation. Please give me restaurant name along with its menu items and price for each menu item. Return it as object json object of name, Array<menu_items> without ```json"
    }
    const response = await axios.post('http://localhost:4000/generate', data);
    const result = response.data?.filter((element) => element.role === 'model')?.map((element) => element.parts[0]);
    const text = result[result?.length - 1]?.text;
    let parsedDetails = JSON.parse(text);
    setRestaurantName(parsedDetails['name']);
    setMenuItems(parsedDetails['menu_items']);
    setLoading(false);
  }
  return <>
    <div className='sidebar flex-center'>
      <div className='select-cuisine'>
        <label htmlFor="cuisine">Pick a cuisine</label>
        <select className='cuisine' id="cuisine" onChange={(e) => handleCuisine(e)}>
          <option value="">Select Cuisine</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
        </select>
      </div>
    </div>
    <div className='content'>
      <div className='restaurant-details'>
        <h1>Restaurant Name Generator</h1>
        <div className='detailsHistory'>
          {loading && menuItems?.length === 0 ? <div>Loading...</div> : <Restaurant restaurantName={restaurantName} menuItems={menuItems} />}
        </div>
      </div>
    </div>
  </>
}

const Restaurant = ({ restaurantName, menuItems }) => {
  const isRestaurantReady = restaurantName && menuItems?.length;
  const columns = [
    {
      title: 'Menu Item',
      dataIndex: 'menu_item',
      key: 'menu_item'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action'
    }
  ];

  let dataSource = [], key = 0;
  menuItems?.forEach((item) => {
    dataSource.push({
      key: ++key,
      menu_item: item?.name,
      description: item?.description,
      action: <MenuActiions menuItemName={item?.name}/>
    });
  });
  
  return <>{isRestaurantReady ? (<div className='restaurant'>
    <h2 className="restaurantName">{restaurantName}</h2>
    <div className='menuItems'>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  </div>) :
    (<p><span id='leftArrow'>&#8592;</span><span>Once you pick a cuisine, you will see restaurant name along with menu items.</span></p>)
  }
  </>
}

const MenuActiions = ({menuItemName}) => {
    return <div className='actions'>
      <Link to={`/pricing/${menuItemName}`}>Pricing</Link>
      <Link to={`/recipe/${menuItemName}`}>Recipe</Link>
    </div>
}

const Recipe = () => {

}

export default App;
