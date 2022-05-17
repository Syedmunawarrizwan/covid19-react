import React from "react";
import { useEffect, useState } from "react";
import "./Table.css";
const Table = () => {
  const [countriesName, setCountriesName] = useState([]);
  const [countriesConfirmed, setCountriesConfirmed] = useState([]);
  const [countriesDeaths, setCountriesDeaths] = useState([]);
  const [countriesRecoverd, setCountriesRecoverd] = useState([]);
  const [search, setSearch] = useState("");
  const baseUrl = "https://api.covid19api.com";

  useEffect(() => {
    getCountriesName();
  }, []);

  const getCountriesName = async () => {
    const rawData = await fetch(`${baseUrl}/summary`);
    const jsonData = await rawData.json();
    setCountriesName(jsonData.Countries);
    setCountriesConfirmed(jsonData.Countries);
    setCountriesDeaths(jsonData.Countries);
    setCountriesRecoverd(jsonData.Countries);
    console.log(jsonData.Countries);
  };

  const getFromUserInput = () => {};

  return (
    <div className="table-div">
      <div>
        <input
          type="text"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <table>
        <tbody>
          <tr>
            <th>Country</th>
            <th>Confirmed</th>
            <th>Deaths</th>
            <th>Recovered</th>
          </tr>

          <tr>
            {" "}
            <td>
              {countriesName.map((country) => {
                return <tr>{country.Country}</tr>;
              })}
            </td>
            <td>
              {countriesConfirmed.map((country) => {
                return <tr>{country.TotalConfirmed}</tr>;
              })}
            </td>
            <td>
              {" "}
              {countriesDeaths.map((country) => {
                return <tr>{country.TotalDeaths}</tr>;
              })}
            </td>
            <td>
              {" "}
              {countriesRecoverd.map((country) => {
                return <tr>{country.TotalRecovered}</tr>;
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Table;
