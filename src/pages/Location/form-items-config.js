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
    required: true, message: 'Bitte einen Typen auswählen'
  }],
  type: 'types',
  getInitialValue: component => component.props.item.types
}, {
  name: 'description',
  label: 'Beschreibung',
  rules: [{
    message: 'Bitte eine Beschreibung angeben',
    whitespace: true
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
  name: 'telephone',
  label: 'Telefonnummer',
  rules: [{
    max: 15,
    min: 3,
    message: 'Bitten eine Telefonnummer angeben'
  }],
  getInitialValue: component => component.props.item.telephone
}, {
  label: 'Adresse',
  type: 'multipleinput',
  children: [{
    name: 'address',
    label: 'Straße',
    style: { width: '50%' },
    rules: [{
      type: 'string', message: 'Bitten eine Adresse eingeben'
    }],
    getInitialValue: component => component.props.item.address
  }, {
    name: 'zipcode',
    label: 'PLZ',
    rules: [{
      type: 'string', message: 'Bitten eine gültige PLZ eingeben', len: 5
    }],
    getInitialValue: component => component.props.item.zipcode
  }, {
    name: 'city',
    label: 'Stadt',
    rules: [{
      type: 'string', message: 'Bitten eine gültige URL angeben'
    }],
    getInitialValue: component => component.props.item.city
  }]
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
  name: 'funded',
  label: 'Landesgefördert',
  type: 'switch',
  valuePropName: 'checked',
  getInitialValue: component => component.props.item.funded
}, {
  name: 'venues',
  label: 'Spielstätten',
  rules: [],
  type: 'venues'
}, {
  label: 'ÖPVN',
  type: 'multipleinput',
  children: [{
    name: 'transportation.subway',
    label: 'U-Bahn',
    getInitialValue: component => component.props.item.transportation
    && component.props.item.transportation.subway
  }, {
    name: 'transportation.railway',
    label: 'S-Bahn',
    getInitialValue: component => component.props.item.transportation
    && component.props.item.transportation.railway
  }, {
    name: 'transportation.bus',
    label: 'Bus',
    getInitialValue: component => component.props.item.transportation
    && component.props.item.transportation.bus
  }, {
    name: 'transportation.tram',
    label: 'Tram',
    getInitialValue: component => component.props.item.transportation
    && component.props.item.transportation.tram
  }]
}, {
  label: 'Barrierefreiheit',
  type: 'multipleinput',
  childrenLabel: 'Menschen im Rollstuhl und Gehbehinderte',
  children: [
    {
      name: 'accessibility.wheelchair.accessible',
      label: 'Generell zugänglich',
      type: 'accessibility',
      rules: [{
        type: 'string', enum: ['Ja', 'Nein', 'Teilweise', 'Unbekannt']
      }],
      getInitialValue: component => component.props.item.accessibility
        && component.props.item.accessibility.wheelchair
        && component.props.item.accessibility.wheelchair.accessible
    }, {
      name: 'accessibility.wheelchair.toilets',
      label: 'WC zugänglich',
      type: 'switch',
      valuePropName: 'checked',
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.wheelchair
      && component.props.item.accessibility.wheelchair.toilets
    }, {
      name: 'accessibility.wheelchair.description',
      label: 'Zusatz',
      rules: [{
        message: 'Bitte eine Beschreibung angeben',
        whitespace: true
      }, {
        message: 'Die Beschreibung darf maximal 350 Zeichen enthalten',
        max: 350
      }],
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.wheelchair
      && component.props.item.accessibility.wheelchair.description
    }
  ]
}, {
  label: ' ',
  type: 'multipleinput',
  childrenLabel: 'Blinde und Sehbehinderte',
  children: [
    {
      name: 'accessibility.blind.braille',
      label: 'Brailleschrift',
      type: 'switch',
      valuePropName: 'checked',
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.blind
      && component.props.item.accessibility.blind.braille
    }, {
      name: 'accessibility.blind.guidance',
      label: 'Taktiles Leitsystem',
      type: 'switch',
      valuePropName: 'checked',
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.blind
      && component.props.item.accessibility.blind.guidance
    }, {
      name: 'accessibility.blind.audioguide',
      label: 'Audioguide',
      type: 'switch',
      valuePropName: 'checked',
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.blind
      && component.props.item.accessibility.blind.audioguide
    }, {
      name: 'accessibility.blind.description',
      label: 'Zusatz',
      rules: [{
        message: 'Bitte eine Beschreibung angeben',
        whitespace: true
      }, {
        message: 'Die Beschreibung darf maximal 350 Zeichen enthalten',
        max: 350
      }],
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.blind
      && component.props.item.accessibility.blind.description
    }
  ],
}, {
  label: ' ',
  type: 'multipleinput',
  childrenLabel: 'Gehörlose und Hörgeschädigte',
  children: [
    {
      name: 'accessibility.deaf.subtitles',
      label: 'Unter-/ Übertitel',
      type: 'switch',
      valuePropName: 'checked',
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.deaf
      && component.props.item.accessibility.deaf.subtitles
    }, {
      name: 'accessibility.deaf.signLanguage',
      label: 'Gebärdensprache',
      type: 'switch',
      valuePropName: 'checked',
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.deaf
      && component.props.item.accessibility.deaf.signLanguage
    }, {
      name: 'accessibility.deaf.hearingAid',
      label: 'Hörunterstützung',
      type: 'switch',
      valuePropName: 'checked',
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.deaf
      && component.props.item.accessibility.deaf.hearingAid
    }, {
      name: 'accessibility.deaf.description',
      label: 'Zusatz',
      rules: [{
        message: 'Bitte eine Beschreibung angeben',
        whitespace: true
      }, {
        message: 'Die Beschreibung darf maximal 350 Zeichen enthalten',
        max: 350
      }],
      getInitialValue: component => component.props.item.accessibility
      && component.props.item.accessibility.deaf
      && component.props.item.accessibility.deaf.description
    }
  ],
}];
