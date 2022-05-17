import { useEffect, useState } from "react";
import "./Stats.css";
import "../../node_modules/bootstrap/dist/css/bootstrap-reboot.min.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DEFAULT_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },

    title: {
      display: true,
    },
  },
  scales: {
    yAxis: {
      min: 663500,
    },
  },
};

const Stats = () => {
  const [countriesData, setCountriesData] = useState([]);

  const [graphData, setGraphData] = useState({});

  const [graphOptions, setGraphOptions] = useState(DEFAULT_OPTIONS);

  const CASES_STATUS = ["confirmed", "recovered", "deaths"];

  const filterFields = ["location", "status", "start_date", "end_date"];

  const baseUrl = "https://api.covid19api.com";

  useEffect(() => {
    getCountriesData();
  }, []);

  const getCountriesData = async () => {
    const rawData = await fetch(`${baseUrl}/countries`);
    const jsonData = await rawData.json();
    setCountriesData(jsonData);
  };

  const applyFilters = (event) => {
    event.preventDefault();
    const formData = {};
    for (const field of filterFields) {
      formData[field] = event.target[field].value;
    }
    getFilteredData(formData);
  };

  const getFilteredData = async (formData) => {
    const data = await fetch(
      `${baseUrl}/total/country/${formData.location}/status/${formData.status}?from=${formData.start_date}&to=${formData.end_date}`
    );
    const jsonData = await data.json();
    // setGraphData(jsonData);
    formatGraphData(jsonData);
  };

  const formatGraphData = (graphData) => {
    const labels = [];
    const dataSet = [];
    let min = graphData[0].Cases;
    graphData.forEach((rawData) => {
      if (rawData.Cases < min) {
        min = rawData.Cases;
      }
      labels.push(moment(rawData.Date).format("DD/MM/YYYY"));
      dataSet.push(rawData.Cases);
    });
    const data = {
      labels: labels,
      datasets: [
        {
          data: dataSet,
          label: "cases",
          backgroundColor: "#e28743",
        },
      ],
    };
    const newScales = {
      yAxis: {
        // The axis for this scale is determined from the first letter of the id as `'x'`
        // It is recommended to specify `position` and / or `axis` explicitly.
        min: min,
      },
    };
    setGraphOptions((prevState) => {
      return { ...prevState, scales: newScales };
    });
    setGraphData(data);
  };

  return (
    <div className="stats-div">
      <form onSubmit={applyFilters}>
        <div className="filters-panel">
          <div className="form-group">
            <label htmlFor="location">Country</label>
            <select id="location" name="location">
              {countriesData.map((country) => {
                return <option>{country.Slug}</option>;
              })}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status">
              {CASES_STATUS.map((status) => {
                return <option value={status}>{status}</option>;
              })}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="start_date">Start Date</label>
            <input type="date" id="start_date" name="start_date"></input>
          </div>
          <div className="form-group">
            <label htmlFor="end_date">End Date</label>
            <input type="date" id="end_date" name="end_date"></input>
          </div>
          <button className="btn btn-warning">Show Graph</button>
        </div>
      </form>

      {Object.keys(graphData).length !== 0 ? (
        <Bar options={graphOptions} data={graphData}></Bar>
      ) : null}
    </div>
  );
};
export default Stats;
