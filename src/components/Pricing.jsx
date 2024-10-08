import { Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./pricing.css";

export default function Pricing() {
    const {menu_item} = useParams();
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);

    const columns = [
        {
            title:'City',
            dataIndex:'city',
            key:'city'
        },
        {
            title: 'Pricing',
            dataIndex: 'pricing',
            key: 'pricing'
        }
    ]

    const pricingQuote = async () => {
        const data = {
            "prompt":`For the menu item ${menu_item}, please provide me with appropriate price city wise for top 10 cities in india. Return it as a list of object containing city_name and price in json format. Return it without any extra description, text, json and '''.`
        }
        const response = await axios.post('http://localhost:4000/generate',data)
        const result = response.data[response?.data?.length - 1];
        const cityObject = JSON.parse(result?.parts[0]?.text);
        console.log(cityObject);
        let dataSource = cityObject.map((city) => ({'city': city?.city_name, 'pricing': city?.price}));
        setDataSource(dataSource);
        setLoading(false);
        console.log('dataSource:', dataSource);
    }

    useEffect(() => {
        if (menu_item) {
            pricingQuote();
        }
    }, []);

    return <div id="pricingDiv">
        {loading ? <div>Loading...</div> 
                : <Table columns={columns} dataSource={dataSource} rowKey={(record) => record.id}/>}
    </div>
}