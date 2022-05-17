import React from "react";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../node_modules/bootstrap/dist/css/bootstrap-reboot.min.css";
const Table = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  // const [debounceTimer, setDebounceTimer] = useState(null);
  const baseUrl = "https://api.covid19api.com";

  useEffect(() => {
    getCountriesName();
  }, []);

  const getCountriesName = async () => {
    const rawData = await fetch(`${baseUrl}/summary`);
    const jsonData = await rawData.json();
    setCountriesData(jsonData.Countries);
    setOriginalData(jsonData.Countries);
  };

  const filterFromUserInput = (searchVal) => {
    console.log("called");
    const searchData = originalData.filter((country) => {
      return country.Country.toLowerCase().includes(searchVal.toLowerCase());
    });
    setCountriesData(searchData);
  };

  return (
    <div className="table-div">
      <div>
        <label htmlFor="exampleDataList" className="form-label">
          Search by CountryName
        </label>
        <input
          className="form-control"
          list="datalistOptions"
          id="exampleDataList"
          placeholder="Type to search..."
          onChange={(e) => {
            filterFromUserInput(e.target.value);
          }}
        />
        <datalist id="datalistOptions">
          {countriesData.map((country) => {
            return <option value={country.Country} />;
          })}
          {/* <option value="India" />
          <option value="United state of America" />
          <option value="Canada" />
          <option value="New Zealand" /> */}
        </datalist>
        <h1>List</h1>
      </div>
      <table className="table table-dark table-hover">
        <tbody>
          <tr>
            <th>Country</th>
            <th>Confirmed</th>
            <th>Deaths</th>
            <th>Recovered</th>
          </tr>
          {countriesData.map((country) => {
            return (
              <tr>
                <td className="table-primary">{country.Country}</td>
                <td className="table-primary">{country.TotalConfirmed}</td>
                <td className="table-primary">{country.TotalDeaths}</td>
                <td className="table-primary">{country.TotalRecovered}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
