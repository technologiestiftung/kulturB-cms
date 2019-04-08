export default [
  {
    name: 'name',
    label: 'Name',
    initialValue: 'Beispiel Einrichtung',
    defaultValue: '',
    rules: [{
      required: true,
      message: 'Bitte einen Namen angeben',
      whitespace: true
    }],
    type: 'input'
  },
  {
    name: 'description',
    label: 'Beschreibung',
    initialValue: 'Lorem ipsum dolor. Sit amet morbi nunc posuere mus. Ut vestibulum nesciunt ipsum etiam porta maecenas eget nonummy eget diam torquent. Augue in tellus quam odio pellentesque.',
    defaultValue: '',
    rules: [{
      message: 'Bitte eine Beschreibung angeben',
      whitespace: true
    }, {
      message: 'Die Beschreibung darf maximal 350 Zeichen enthalten',
      max: 350
    }],
    type: 'textarea'
  },
  {
    name: 'website',
    label: 'Webseite',
    initialValue: 'https://example.com',
    defaultValue: '',
    rules: [{
      type: 'url', message: 'Bitten eine gültige URL angeben'
    }],
  },
  {
    name: 'telephone',
    label: 'Telefonnummer',
    rules: [{
      max: 15,
      min: 3,
      message: 'Bitten eine Telefonnummer angeben'
    }],
    getInitialValue: component => component.props.item.telephone
  },
  {
    name: 'address',
    label: 'Adresse',
    initialValue: 'Alexanderplatz 1',
    defaultValue: '',
    rules: [{
      type: 'string', message: 'Bitten eine Adresse ein'
    }],
  },
  {
    name: 'openingHours',
    label: 'Öffnungszeiten',
    initialValue: 'Mo-Sa 10-18',
    defaultValue: '',
    rules: [{
      whitespace: true
    }],
  },
  {
    name: 'tags',
    label: 'Kategorien',
    initialValue: ['Theater'],
    defaultValue: [],
    type: 'tags',
  },
  {
    name: 'types',
    label: 'Typ',
    initialValue: ['organisation'],
    defaultValue: [],
    rules: [{
      required: true, message: 'Bitte einen Typen auswählen'
    }],
    type: 'types'
  }
];
