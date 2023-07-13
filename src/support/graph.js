import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';
const BarGraph = ({ data }) => {
    const chartRef = useRef(null);
  
    useEffect(() => {
      const ctx = chartRef.current.getContext('2d');
  
      // Create an array of labels from the indices of the data array
      const labels = data.map((_, index) => index);
  
      // Create a new Chart instance
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Bar Graph',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adjust as per your preference
              borderColor: 'rgba(75, 192, 192, 1)', // Adjust as per your preference
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }, [data]);
  
    return <canvas ref={chartRef} />;
  };
  