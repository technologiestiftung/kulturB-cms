export default (item) => {
  const {
    name,
    description,
    logo,
    website,
    email,
    telephone,
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
  const location = {
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
    res.location = location;

    res.location.address = [address, zipcode, city].join(', ');
  }

  if (openingHours) {
    if (!res.location) res.location = location;
    res.location.openingHours = openingHours;
  }

  return `<script type="application/ld+json">
  ${JSON.stringify(res, null, 2)}
  </script>`;
};
