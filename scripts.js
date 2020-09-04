const pso2percent = {
  FIELDS: ['base', 'units-rings', 'weapon', 'weapon-affix', 'buffs', 'def', 'ele-weak', 'type'],
  DIGITS: 2,
  state: {},
  freedom: false,
  init: function () {
    pso2percent.setInitialState();
    pso2percent.addInputListeners();
  },
  setInitialState: function () {
    pso2percent.state = pso2percent.FIELDS.map(function (field) {
      return {
        key: field,
        value: pso2percent.parseFieldValue(field, document.getElementById(field + '-input').value),
      };
    }).reduce(function (state, field) {
      state[field.key] = field.value;
      return state;
    }, {});
    const currentState = Object.assign({}, pso2percent.state);
    pso2percent.FIELDS.forEach(function (field) {
      pso2percent.renderState(field, currentState[field]);
    });
    pso2percent.renderResult();
  },
  addInputListeners: function () {
    pso2percent.FIELDS.forEach(function (field) {
      document.getElementById(field + '-input').addEventListener('input', function (event) {
        pso2percent.updateState(field, event.target.value);
      });
    });
    document.getElementById('freedom-button').addEventListener('click', pso2percent.toggleFreedom);
  },
  parseFieldValue: function (field, value) {
    if (field === 'type') {
      if (value === 'tech') {
        return value;
      }
      return 'photon-art';
    }
    if (field === 'buffs' || field ==='ele-weak') {
      return Math.max(-100, Number(value)) || 0;
    }
    return Math.max(0, Number(value)) || 0;
  },
  updateState: function (field, value) {
    const parsedValue = pso2percent.parseFieldValue(field, value);
    if (pso2percent.state[field] !== parsedValue) {
      pso2percent.state[field] = parsedValue;
      pso2percent.renderState(field, parsedValue);
      pso2percent.renderResult();
    }
  },
  renderState: function (field, value) {
    if (field === 'type') {
      const eleDamageElements = document.getElementsByClassName('ele-damage');
      if (value === 'photon-art') {
        for (let i = 0; i < eleDamageElements.length; i++) {
          eleDamageElements[i].classList.remove('hidden');
        }
      } else {
        for (let i = 0; i < eleDamageElements.length; i++) {
          eleDamageElements[i].classList.add('hidden');
        }
      }
    } else if (field === 'buffs' || field === 'ele-weak') {
      let multiplierPercent = value + 100;
      document.getElementById(field).innerText = multiplierPercent.toFixed(pso2percent.DIGITS) + '%';
    } else {
      document.getElementById(field).innerText = value.toFixed(pso2percent.DIGITS);
      if (field === 'weapon') {
        document.getElementById(field + '-2').innerText = value.toFixed(pso2percent.DIGITS);
      }
    }
  },
  renderResult: function () {
    const currentState = Object.assign({}, pso2percent.state);
    let result = ( currentState['base'] * (1 + currentState['buffs'] * 0.01) ) + 
      currentState['units-rings'] + currentState['weapon'] + currentState['weapon-affix'] - currentState['def'];
    if (currentState['type'] === 'photon-art') {
      result += currentState['weapon'] * 0.6 * (1 + currentState['ele-weak'] * 0.01);
    }
    if (result >= 0) {
      document.getElementById('result').innerText = result.toFixed(pso2percent.DIGITS);
      for (let i = 1; i <= 5; i++) {
        document.getElementById('percent-' + String(i)).innerText = (result * 0.01 * i).toFixed(pso2percent.DIGITS);
      }
    } else {
      document.getElementById('result').innerText = '?';
      for (let i = 1; i <= 5; i++) {
        document.getElementById('percent-' + String(i)).innerText = '?';
      }
    }
  },
  toggleFreedom: function () {
    pso2percent.freedom = !pso2percent.freedom;
    pso2percent.renderFreedom();
  },
  renderFreedom: function () {
    const freedomButton = document.getElementById('freedom-button');
    const textJpElements = document.getElementsByClassName('text-jp');
    const textEnElements = document.getElementsByClassName('text-en');
    if (pso2percent.freedom) {
      freedomButton.classList.remove('inactive');
      for (let i = 0; i < textJpElements.length; i++) {
        textJpElements[i].classList.add('hidden');
      }
      for (let i = 0; i < textEnElements.length; i++) {
        textEnElements[i].classList.remove('hidden');
      }
    } else {
      freedomButton.classList.add('inactive');
      for (let i = 0; i < textJpElements.length; i++) {
        textJpElements[i].classList.remove('hidden');
      }
      for (let i = 0; i < textEnElements.length; i++) {
        textEnElements[i].classList.add('hidden');
      }
    }
  },
};

document.addEventListener('DOMContentLoaded', pso2percent.init);


