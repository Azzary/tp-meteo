class MyMeteo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {

    const ville = this.getAttribute('ville') || 'Paris';

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <div>Chargement de la météo pour ${ville}...</div>
    `;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.prevision-meteo.ch/services/json/${ville}`);
    xhr.onload = () => {
      if (xhr.status !== 200) {
        return shadowRoot.innerHTML = `Erreur : Impossible de récupérer la météo pour ${ville}.`;;
      }
      const data = JSON.parse(xhr.responseText);

      if (data.errors) {
        return shadowRoot.innerHTML = `Erreur : Impossible de récupérer la météo pour ${ville}.`;;
      }
      const pays = data.city_info.country;
      const heure = data.current_condition.hour;
      const vent = data.current_condition.wnd_spd;
      const humidite = data.current_condition.humidity;
      const date = data.current_condition.date;
      const logo = data.current_condition.icon_big;

      shadowRoot.innerHTML = `
          <style>
            h2 {
              color: #494949;
              font-weight: bold;
            }
            div{
              border: solid 1px;
              border-radius: 30px;
              margin: 0;
              padding: 00px;
              margin-top: 20px;
              text-align: center;
              width: 300px;
              display: inline-block;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              margin: 0 0 10px;
            }
            img {
              max-width: 100%;
            }
          </style>
          <div> 
            <h2>${ville}, ${pays}</h2>
            <p>Heure locale : ${heure}</p>
            <p>Date : ${date}</p>
            <p>Vitesse du vent : ${vent} km/h</p>
            <p>Taux d'humidité : ${humidite}%</p>
            <img src="${logo}">
          </div>
        `;

    };
    xhr.send();
  }
}

customElements.define('my-meteo', MyMeteo);