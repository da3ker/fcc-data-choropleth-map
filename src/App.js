import './App.scss';
import {useState, useEffect} from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson';

function App() {
 const [countyData, setCountyData] = useState([])
 const [educationData, setEducationData] = useState([])

 let countyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
 let educationUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

 let canvas = d3.select('#canvas')
 let tooltip = d3.select('#tooltip')

useEffect(() => {
  async function fetchCData(){
    let response = await fetch(countyUrl);
    let data = await response.json();
    data = feature(data, data.objects.counties).features
    setCountyData(data)
    console.log(data)
      async function fetchEData(){
        let response = await fetch(educationUrl);
        let data = await response.json();
        setEducationData(data)
        console.log(data)
      }
      fetchEData()
  }
  fetchCData()
}, [])

let max = d3.max(educationData, (d) => d["bachelorsOrHigher"])
console.log(max)

const drawMap = () => {
  canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (d) => {
          let id = d['id']
          let county = educationData.find((i) => {
            return i['fips'] === id
          })
          let percentage = county["bachelorsOrHigher"]
          
          if(percentage <= 10){
            return '#96DEAE'
          }else if(percentage <= 20){
            return '#73D393'
          }else if(percentage <= 30){
            return '#63AB7B'
          }else if(percentage <= 40){
            return '#5ABA7A'
          }else if(percentage <= 50){
            return '#40A060'
          }else{
            return '#307848'
          }
        })
        .attr('data-fips', (d) => d['id'])
        .attr('data-education', (d) => {
          let id = d['id']
          let county = educationData.find((i) => {
            return i['fips'] === id
          })
          let percentage = county["bachelorsOrHigher"]
          return percentage;
        })
        .on('mouseover', (d) => {
          tooltip.transition()
                 .duration(100)
                 .style('visibility', 'visible')

          let id = d['id']
          let county = educationData.find((i) => {
            return i['fips'] === id
          })

          tooltip.html(county['area_name'] + ', ' + county['state'] + ': ' + county['bachelorsOrHigher'] + '%')
          tooltip.style("left", d3.event.pageX + 20 + "px")
                .style("top", d3.event.pageY - 20 + "px")   

          tooltip.attr('data-education', county["bachelorsOrHigher"])
        })
        .on('mouseout', (d) => {
          tooltip.transition()
                 .duration(100)
                 .style('visibility', 'hidden')
        })
}

useEffect(() => {
  drawMap()
}, [educationData])

  return (
    <div className="App">
     <h2 id="title">United States Educational Attainment</h2>
     <svg id="canvas">
     <text id="description" x="50%" y="3%" dominantBaseline="middle" textAnchor="middle">Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</text>
       <svg id="legend">
        <g>
            <rect x="880" y="390" width="10" height="10" fill='#307848' />
            <text x="895" y="398">51% and above</text>
        </g>

        <g>
            <rect x="880" y="410" width="10" height="10" fill='#40A060' />
            <text x="895" y="418">41% - 50%</text>
        </g>

        <g>
            <rect x="880" y="430" width="10" height="10" fill='#5ABA7A' />
            <text x="895" y="438">31% - 40%</text>
        </g>

        <g>
            <rect x="880" y="450" width="10" height="10" fill='#63AB7B' />
            <text x="895" y="458">21% - 30%</text>
        </g>

        <g>
            <rect x="880" y="470" width="10" height="10" fill='#73D393' />
            <text x="895" y="478">11% - 20%</text>
        </g>

        <g>
            <rect x="880" y="490" width="10" height="10" fill='#96DEAE' />
            <text x="895" y="498">10% and below</text>
        </g>  
       </svg>  
     </svg>
     <br/>
     <span id="da3ker">by da3ker</span>
     <div id="tooltip"></div>
    </div>
  );
}

export default App;
