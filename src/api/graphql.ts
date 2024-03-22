async function getGraphQL({
  query = '', variables = {}, store = '', commerceUrl = `${window.origin}/graphql`
}) {
  const response = await fetch(commerceUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Store: store },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json());

  return response;
}

export { getGraphQL };
