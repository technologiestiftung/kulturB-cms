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
    openingHours
  } = item;

  const res = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name
  };
  const locationSchema = {
    '@type': 'CivicStructure'
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
