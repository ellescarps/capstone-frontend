import { useState } from 'react';
import { API_URL } from '../API';  // Ensure this path is correct based on your file structure

const useShipping = () => {
    const [shippingCost, setShippingCost] = useState('');

    const getShippingCost = async (fromZip, toZip, weight) => {
        try {
            const response = await fetch(`${API_URL}/shipping-rates?fromZip=${fromZip}&toZip=${toZip}&weight=${weight}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Error fetching shipping rates:", error);
            return null;
        }
    };
    

    const setShippingCostFromAPI = (rates) => {
        if (rates && rates.length > 0) {
            setShippingCost(rates[0].amount);  
        } else {
            setShippingCost('N/A');
        }
    };

    return { getShippingCost, setShippingCostFromAPI };
};

export default useShipping;

