export default [{
  name: 'name',
  label: 'Name',
  rules: [{
    required: true, message: 'Bitte einen Namen angeben'
  }],
  getInitialValue: component => component.state.item.name
}, {
  name: 'types',
  label: 'Typ',
  rules: [{
    required: true, message: 'Bitte einen Typen auswählen angeben'
  }],
  type: 'types',
  getInitialValue: component => component.state.item.types
}, {
  name: 'website',
  label: 'Webseite',
  rules: [{
    type: 'string', message: 'Bitten eine gültige URL angeben'
  }],
  getInitialValue: component => component.state.item.website
}, {
  name: 'address',
  label: 'Adresse',
  rules: [{
    type: 'string', message: 'Bitten eine Adresse ein'
  }],
  getInitialValue: component => component.state.item.address
}, {
  name: 'zipcode',
  label: 'PLZ',
  rules: [{
    type: 'string', message: 'Bitten eine gültige PLZ ein', len: 5
  }],
  getInitialValue: component => component.state.item.zipcode
}, {
  name: 'city',
  label: 'Stadt',
  rules: [{
    type: 'string', message: 'Bitten eine gültige URL angeben'
  }],
  getInitialValue: component => component.state.item.city
}, {
  name: 'tags',
  label: 'Kategorien',
  rules: [],
  type: 'tags',
  getInitialValue: component => (component.state.item.tags ? component.state.item.tags.map(t => t._id) : undefined)
}];
