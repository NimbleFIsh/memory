import './style.css';
import dataJSON from './data.json';

function createTable(data = false) {
  const table = document.createElement('table');
  let tableData = '<tr id="base"><td id="sort_id">id</td><td id="sort_title">title</td><td id="sort_year">year</td><td id="sort_imdb">imdb</td></tr>';
  if (data) {
    data.forEach((inputData) => {
      tableData += `<tr>
        <td>${inputData.id}</td>
        <td>${inputData.title}</td>
        <td>(${inputData.year})</td>
        <td>imdb: ${inputData.imdb.toFixed(2)}</td>
        </tr>`;
    });
  } else {
    dataJSON.forEach((dataObj) => {
      tableData += `<tr>
        <td>${dataObj.id}</td>
        <td>${dataObj.title}</td>
        <td>(${dataObj.year})</td>
        <td>imdb: ${dataObj.imdb.toFixed(2)}</td>
        </tr>`;
    });
  }
  table.innerHTML = tableData;
  document.body.insertAdjacentElement('afterbegin', table);
}

window.addEventListener('DOMContentLoaded', () => {
  createTable();
  const idStandart = Array.from(document.getElementsByTagName('tr'));

  function createOptimizatedEvents(type, titleMode = false) {
    let clicksCount = 0; // 0 - Standart 1 - Прямая 2 - Обратная
    document.getElementById(`sort_${type}`).addEventListener('click', (e) => {
      createTable();
      if (clicksCount === 2) clicksCount = 0; else clicksCount += 1;
      const id = [];
      document.getElementsByTagName('tr').forEach((el) => el.dataset.id && id.push(el.dataset.id));
      if (clicksCount === 0) {
        idStandart.forEach((el, index) => index !== 0 && idStandart[index - 1].insertAdjacentElement('afterend', el));
        e.target.removeAttribute('class');
      } else {
        if (clicksCount === 2) {
          e.target.classList.remove('arrow_bottom');
          e.target.classList.add('arrow_top');
        } else {
          e.target.classList.remove('arrow_top');
          e.target.classList.add('arrow_bottom');
        }
        let data = Array.from(document.getElementsByTagName('tr')).sort((prev, next) => {
          let result;
          if (titleMode) {
            result = prev.dataset[type] < next.dataset[type] ? -1 : 1;
          } else if (clicksCount === 1) {
            result = next.dataset[type] - prev.dataset[type];
          } else {
            result = prev.dataset[type] - next.dataset[type];
          }
          return result;
        });
        data = (clicksCount === 2 && titleMode) ? data.reverse() : data;
        data.forEach((el) => el.id !== 'base' && data[0].insertAdjacentElement('afterend', el));
      }
    });
  }

  createOptimizatedEvents('id');
  createOptimizatedEvents('title', true);
  createOptimizatedEvents('year');
  createOptimizatedEvents('imdb');
});
