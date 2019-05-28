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
    name: 'logo.url',
    label: 'Logo url',
    rules: [{
      message: 'Bitte einen URL angeben',
      type: 'url'
    }],
    type: 'input'
  },
  {
    name: 'website',
    label: 'Webseite',
    initialValue: 'https://example.com',
    defaultValue: '',
    rules: [{
      type: 'url', message: 'Bitte eine gültige URL angeben'
    }],
  },
  {
    name: 'telephone',
    label: 'Telefonnummer',
    rules: [{
      max: 15,
      min: 3,
      message: 'Bitte eine Telefonnummer angeben'
    }],
    getInitialValue: component => component.props.item.telephone
  },
  {
    name: 'address',
    label: 'Adresse',
    initialValue: 'Alexanderplatz 1',
    defaultValue: '',
    rules: [{
      type: 'string', message: 'Bitte eine Adresse angeben'
    }],
  },
  {
    name: 'zipcode',
    label: 'PLZ',
    initialValue: '10178',
    defaultValue: '',
    rules: [{
      type: 'string', message: 'Bitte eine gültige PLZ eingeben', len: 5
    }],
    getInitialValue: component => component.props.item.zipcode
  },
  {
    name: 'city',
    label: 'Stadt',
    initialValue: 'Berlin',
    defaultValue: 'Berlin',
    rules: [{
      type: 'string', message: 'Bitte eine gültige URL angeben'
    }],
    getInitialValue: component => component.props.item.city
  },
  {
    name: 'openingHours',
    label: 'Öffnungszeiten',
    initialValue: 'Mo-Sa 10:00-18:00',
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
