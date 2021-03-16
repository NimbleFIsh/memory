import './style.css';
import dataJSON from './data.json';

function saveInfo(type, clicks) {
  sessionStorage.sort = JSON.stringify({ type, count: clicks });
}

function getInfo() {
  if (!sessionStorage.sort) sessionStorage.sort = '{}';
  return sessionStorage.sort && JSON.parse(sessionStorage.sort);
}

function clearTable() {
  let repeat = 0;
  while (repeat < 3) {
    document.getElementsByTagName('tr').forEach((el) => el.id !== 'base' && el.remove());
    // Оставляет 2 элемента и удаляет их по одному, не понятно почему, поэтому повтор в цикле
    repeat += 1;
  }
}

function renderTable(data) {
  clearTable();
  const base = document.getElementById('base');
  data.forEach((el) => base.insertAdjacentHTML('afterend', `
    <tr>
      <td>${el.id}</td>
      <td>${el.title}</td>
      <td>(${el.year})</td>
      <td>imdb: ${el.imdb.toFixed(2)}</td>
    </tr>
 `));
}

function sortable() {
  const info = getInfo();
  return dataJSON.sort((prev, next) => {
    let result;
    if (info.type === 'title') {
      result = prev[info.type] < next[info.type] ? -1 : 1;
    } else if (info.count === 1) {
      result = next[info.type] - prev[info.type];
    } else {
      result = prev[info.type] - next[info.type];
    }
    return result;
  });
}

function optEv(type, secondData) {
  let info = getInfo();
  if (info.type === type) {
    saveInfo(type, (info.count < 2) ? info.count + 1 : 0);
  } else {
    saveInfo(type, 1);
    ['id', 'title', 'year', 'imdb'].forEach((y) => {
      if (y !== type) {
        document.getElementById(`sort_${y}`).classList.remove('arrow_top');
        document.getElementById(`sort_${y}`).classList.remove('arrow_bottom');
      }
    });
  }
  info = getInfo();

  if (info.count === 0) {
    document.getElementById(`sort_${type}`).classList.remove('arrow_top');
    document.getElementById(`sort_${type}`).classList.remove('arrow_bottom');
    clearTable();
    const data = secondData.reverse();
    data.forEach((k) => {
      document.getElementById('table').children[0].children[0].insertAdjacentHTML('afterend',
        `<tr><td>${k.id}</td><td>${k.title}</td><td>(${k.year})</td><td>imdb: ${k.imdb.toFixed(2)}</td></tr>`);
    });
  } else {
    if (info.count === 1) {
      document.getElementById(`sort_${type}`).classList.remove('arrow_top');
      document.getElementById(`sort_${type}`).classList.add('arrow_bottom');
    } else {
      document.getElementById(`sort_${type}`).classList.remove('arrow_bottom');
      document.getElementById(`sort_${type}`).classList.add('arrow_top');
    }
    renderTable(sortable());
  }
}

function initListeners() {
  const secondData = dataJSON;
  const info = getInfo();
  if (Object.keys(info).length > 0) {
    document.getElementById(`sort_${info.type}`).classList.add(((info.count === 1) && 'arrow_bottom') || ((info.count === 2) && 'arrow_top'));
    if (document.getElementById(`sort_${info.type}`).classList.contains('arrow_bottom')) renderTable(sortable());
    if (document.getElementById(`sort_${info.type}`).classList.contains('arrow_top')) renderTable(sortable());
  }
  ['id', 'title', 'year', 'imdb'].forEach((type) => document.getElementById(`sort_${type}`).addEventListener('click', () => optEv(type, secondData)));
}

function createTable() {
  if (document.getElementById('table')) document.getElementById('table').remove();
  const table = document.createElement('table');
  table.id = 'table';
  let tableData = '<tr id="base"><td id="sort_id">id</td><td id="sort_title">title</td><td id="sort_year">year</td><td id="sort_imdb">imdb</td></tr>';
  dataJSON.forEach((k) => {
    tableData += `
                  <tr>
                    <td>${k.id}</td>
                    <td>${k.title}</td>
                    <td>(${k.year})</td>
                    <td>imdb: ${k.imdb.toFixed(2)}</td>
                  </tr>
                 `;
  });
  table.innerHTML = tableData;
  document.body.insertAdjacentElement('afterbegin', table);
  initListeners();
}

window.addEventListener('DOMContentLoaded', createTable());
