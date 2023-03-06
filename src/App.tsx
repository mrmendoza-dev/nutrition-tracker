import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from "axios";
import Barcode from "react-barcode";

function App() {

  const [foodData, setFoodData] = useState([]);
 const [currentIndex, setCurrentIndex] = useState(0);

 const [food, setFood] = useState<any>(null);
 const [searchQuery, setSearchQuery] = useState("bread");
  const apiKey = "6l9dSatTP8apXFEXmPyRgPj7GARKd8tboQl16TSQ";

 const handleSubmit = async (event: any) => {
   event.preventDefault();

   searchFood();

 };


 function nextItem() {

  if (currentIndex === foodData.length-1) {
  setCurrentIndex(0);

  } else {
  setCurrentIndex((prevVal) => prevVal + 1);

  }
 }
  function previousItem() {
      if (currentIndex === 0) {
    setCurrentIndex(foodData.length-1);
      } else {
    setCurrentIndex((prevVal) => prevVal - 1);
      }
  }
 useEffect(() => {
   setFood(foodData[currentIndex]);
 }, [currentIndex]);

 useEffect(()=> {
       setFood(foodData[0]);
 }, [foodData])

  useEffect(() => {
    searchFood();
  }, []);


  async function searchFood() {
   try {
     const response = await axios.get(
       `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${searchQuery}`
     );
     console.log(response);
    //  const food = response.data.foods[0];
     setFoodData(response.data.foods);
   } catch (error) {
     console.error(error);
   }
  }

 return (
   <div>
     <form onSubmit={handleSubmit}>
       <label htmlFor="searchQuery">Search for a food:</label>
       <input
         type="text"
         name="searchQuery"
         id="searchQuery"
         value={searchQuery}
         onChange={(event) => setSearchQuery(event.target.value)}
       />
       <button type="submit">Search</button>
     </form>
     <div className="">
       <button onClick={previousItem}>PREVIOUS</button>

       <button onClick={nextItem}>NEXT</button>
     </div>

     <div className="flex">
       <div className="table-wrapper">
         <table className="food-table">
           <thead>
             <tr>
               <th style={{ width: "25%" }}>Description</th>
               <th style={{ width: "25%" }}>Category</th>
               <th style={{ width: "25%" }}>Brand Name</th>
               <th style={{ width: "25%" }}>Brand Owner</th>
             </tr>
           </thead>
           <tbody>
             {foodData.map((foodItem: any, index) => {
               return (
                 <tr
                   key={foodItem.fdcId}
                   className="food-row"
                   onClick={() => {
                     setCurrentIndex(index);
                   }}
                 >
                   <td>{foodItem.description}</td>
                   <td>{foodItem.foodCategory}</td>

                   <td>{foodItem.brandName}</td>
                   <td>{foodItem.brandOwner}</td>
                 </tr>
               );
             })}
           </tbody>
         </table>
       </div>

       {food && (
         <div className="NutritionLabel">
           <h2>{food.description}</h2>
           <p>{food.foodCategory}</p>

           <div className="">
             <p>{food.brandName}</p>
             <p>{food.brandOwner}</p>
           </div>

           <p className="title">Nutrition Facts</p>

           <div className="serving flex-between">
             <p>Serving Size</p>
             <p>
               {food.servingSize}
               {food.servingSizeUnit}
             </p>
           </div>
           <div className="calories">
             <p className="">Amount per serving</p>
             <div className="main flex-between">
               <p className="">Calories </p>
               <p>
                 {
                   food.foodNutrients.find(
                     (nutrient: any) => nutrient.nutrientName === "Energy"
                   ).value
                 }
               </p>
             </div>
           </div>

           <div className="macro-nutrients">
            <p className="">% Daily Value *</p>
            
             <p>
               <strong>Protein</strong>
               {
                 food.foodNutrients.find(
                   (nutrient: any) => nutrient.nutrientName === "Protein"
                 ).value
               }
             </p>
             <p>
               <strong>Carbohydrates</strong>
               {
                 food.foodNutrients.find(
                   (nutrient: any) =>
                     nutrient.nutrientName === "Carbohydrate, by difference"
                 ).value
               }
             </p>
             <p>
               <strong>Fat</strong>
               {
                 food.foodNutrients.find(
                   (nutrient: any) =>
                     nutrient.nutrientName === "Total lipid (fat)"
                 ).value
               }
             </p>
           </div>
           <div className="micro-nutrients">
             <p>
               <strong>Calcium</strong>
               {
                 food.foodNutrients.find(
                   (nutrient: any) => nutrient.nutrientName === "Calcium, Ca"
                 ).value
               }
             </p>
           </div>

           <p className="ingredients">
             <strong>Ingredients:</strong>
             {food.ingredients}
           </p>
           <p className="footnote">
             The % Daily value (DV) tells you how much a nutrient in a serving
             of food contributes to a daily diet. 2,000 calories a day is used
             for general nutrition adivice
           </p>

           <div className="barcode">
             <Barcode value={food.fdcId} format="CODE128" />
           </div>
         </div>
       )}
     </div>
   </div>
 );
}

export default App
