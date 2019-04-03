export default [{
  name: 'published',
  label: 'Veröffentlicht',
  type: 'switch',
  valuePropName: 'checked',
  getInitialValue: component => component.props.item.published
}, {
  name: 'name',
  label: 'Name',
  rules: [{
    required: true,
    message: 'Bitte einen Namen angeben',
    whitespace: true
  }],
  getInitialValue: component => component.props.item.name
}, {
  name: 'types',
  label: 'Typ',
  rules: [{
    required: true, message: 'Bitte einen Typen auswählen angeben'
  }],
  type: 'types',
  getInitialValue: component => component.props.item.types
}, {
  name: 'description',
  label: 'Beschreibung',
  rules: [{
    message: 'Bitte eine Beschreibung angeben',
    whitespace: true,
  }, {
    message: 'Die Beschreibung darf maximal 350 Zeichen enthalten',
    max: 350
  }],
  type: 'textarea',
  getInitialValue: component => component.props.item.description
}, {
  name: 'website',
  label: 'Webseite',
  rules: [{
    type: 'url', message: 'Bitten eine gültige URL angeben'
  }],
  getInitialValue: component => component.props.item.website
}, {
  name: 'address',
  label: 'Adresse',
  rules: [{
    type: 'string', message: 'Bitten eine Adresse ein'
  }],
  getInitialValue: component => component.props.item.address
}, {
  name: 'zipcode',
  label: 'PLZ',
  rules: [{
    type: 'string', message: 'Bitten eine gültige PLZ ein', len: 5
  }],
  getInitialValue: component => component.props.item.zipcode
}, {
  name: 'city',
  label: 'Stadt',
  rules: [{
    type: 'string', message: 'Bitten eine gültige URL angeben'
  }],
  getInitialValue: component => component.props.item.city
}, {
  name: 'accessibility_wheelchair',
  label: 'Rollstuhlgerecht',
  type: 'accessibility',
  rules: [{
    type: 'string', enum: ['Ja', 'Nein', 'Teilweise', 'Unbekannt']
  }],
  getInitialValue: component => component.props.item.accessibility_wheelchair || 'unknown'
}, {
  name: 'accessibility_blind',
  label: 'Hilfsmittel für Menschen mit Blindheit und Sehbehinderung',
  rules: [{
    type: 'string'
  }],
  getInitialValue: component => component.props.item.accessibility_blind
}, {
  name: 'accessibility_deaf',
  label: 'Hilfsmittel für Gehörlose Menschen',
  rules: [{
    type: 'string'
  }],
  getInitialValue: component => component.props.item.accessibility_deaf
}, {
  name: 'openingHours',
  label: 'Öffnungszeiten',
  rules: [{
    whitespace: true
  }],
  type: 'openingHours',
  getInitialValue: component => component.props.item.openingHours
}, {
  name: 'tags',
  label: 'Kategorien',
  rules: [],
  type: 'tags',
  getInitialValue: component => (
    component.props.item.tags
    ? component.props.item.tags.map(t => t._id)
    : undefined
  )
}, {
  name: 'venues',
  label: 'Spielstätten',
  rules: [],
  type: 'venues'
}];
