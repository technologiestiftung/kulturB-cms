export default (item) => {
  const {
    _id,
    type,
    name,
    description,
    website,
    email,
    telephone
  } = item;

  const res = {
    '@context': 'http://schema.org',
    '@type': type,
    '@id': _id,
    name
  };

  if (description) res.description = description;
  if (website) res.url = res.website = res.sameAs = website;
  if (email) res.email = email;
  if (telephone) res.telephone = telephone;

  return JSON.stringify(res, null, 2);
};
