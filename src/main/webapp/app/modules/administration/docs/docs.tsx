import './docs.scss';

import React from 'react';

const DocsPage = () => (
  <div>
    <iframe
      src="api/v2/api-docs"
      width="100%"
      height="800"
      title="Swagger UI"
      seamless
      style={{ border: 'none' }}
      data-cy="swagger-frame"
    />
  </div>
);

export default DocsPage;
