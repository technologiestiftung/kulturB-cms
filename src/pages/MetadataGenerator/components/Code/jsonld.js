export default (item) => {
  const {
    name,
    description,
    logo,
    website,
    email,
    telephone,
    location,
    address,
    zipcode,
    city,
    openingHours,
    tags
  } = item;

  const res = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name
  };

  let type = 'CivicStructure';
  if (tags) {
    if (tags.includes('Theater') || tags.includes('Tanz/Performance')) {
      type = 'PerformingArtsTheater';
    }

    if (tags.includes('Konzert') || tags.includes('Musik') || tags.includes('Musikschule') || tags.includes('Oper')) {
      type = 'MusicVenue';
    }

    if (tags.includes('Museum') || tags.includes('Bildende Kunst') || tags.includes('Galerie') || tags.includes('Ausstellungshaus') || tags.includes('Gedenkstätte')) {
      type = 'Museum';
    }
  }

  const locationSchema = {
    '@type': type
  };

  if (description) res.description = description;
  if (logo && logo.url) res.logo = logo.url;
  if (website) {
    res.url = website;
    res.sameAs = website;
  }
  if (email) res.email = email;
  if (telephone) res.telephone = telephone;
  if (address && zipcode && city) {
    res.location = locationSchema;

    res.location.address = [address, zipcode, city].join(', ');
  }

  if (openingHours) {
    if (!res.location) res.location = locationSchema;
    res.location.openingHours = openingHours;
  }

  if (location && location.coordinates) {
    if (!res.location) res.location = locationSchema;

    const [latitude, longitude] = location.coordinates;
    res.location.geo = {
      '@type': 'GeoCoordinates',
      latitude,
      longitude
    };
  }

  return `
<script type="application/ld+json">
  ${JSON.stringify(res, null, 2)}
</script>
  `.trim();
};
